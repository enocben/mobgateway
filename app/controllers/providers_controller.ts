import type { HttpContext } from '@adonisjs/core/http'
import Provider from '#models/provider'
import ProviderRoute from '#models/provider_route'
import db from '@adonisjs/lucid/services/db'
import ProviderTransformer from '#transformers/provider_transformer'
import Country from '#models/country'
import CountryTransformer from '#transformers/country_transformer'
import MobileOperatorTransformer from '#transformers/mobile_operator_transformer'
import { inject } from '@adonisjs/core'
import { ProviderService } from '#services/provider_service'
import {
  attachCountryValidator,
  storeProviderRouteValidator,
  updateProviderValidator,
} from '#validators/provider'

@inject()
export default class ProvidersController {
  constructor(protected providerService: ProviderService) {
  }
  /**
   * GET /admin/:id/providers — List all providers for the dashboard.
   * Providers are code-driven; creation happens via new classes, not the UI.
   */
  async index({ inertia }: HttpContext) {
    const providers = await Provider.query()
      .preload('routes')
      .preload('transactions')
      .orderBy('code', 'asc')

    return inertia.render('admin/Providers/List', {
      providers: ProviderTransformer.transform(providers),
    })
  }

  async providersDetail({ params, inertia }: HttpContext) {
    const data = await this.providerService.getDetail(params.id, params.providerId)

    return inertia.render('admin/Providers/Detail', {
      provider: ProviderTransformer.transform(data.provider),
      availableCountries: CountryTransformer.transform(data.availableCountries),
      availableOperators: MobileOperatorTransformer.transform(data.availableOperators),
      stats: data.stats,
    })
  }

  /**
   * Detach a country from a provider (scoped to current application).
   */
  async providersDestroyCountry({ params, response, session }: HttpContext) {
    const [error, data] = await attachCountryValidator.tryValidate(params)

    if (error) {
      session.flash('errors', { country: error.messages })
      return response.redirect().back()
    }

    const country = await Country.findOrFail(data.countryId)
    const provider = await Provider.query()
      .where('id', params.providerId)
      .firstOrFail()

    await provider.related('countries').detach([country.id])

    session.flash('success', `Country ${country.name} removed from ${provider.name}`)
    return response.redirect().back()
  }

  /**
   * Attach a country to a provider (scoped to current application).
   */
  async createProvider({ params, response, session }: HttpContext) {
    const [error, data] = await attachCountryValidator.tryValidate(params)

    if (error) {
      session.flash('errors', { country: error.messages })
      return response.redirect().back()
    }

    const provider = await Provider.findOrFail(params.providerId)
    const country = await Country.findOrFail(data.countryId)

    const existing = await provider.related('countries').query()
      .where('country_id', country.id)
      .first()

    if (!existing) {
      await provider.related('countries').attach([country.id])
      session.flash('success', `Country ${country.name} added to provider`)
    }

    return response.redirect().back()
  }

  /**
   * Attach a mobile operator to a provider via a new route (scoped to current app).
   */
  async storeProviderRoute({ params, request, response, session }: HttpContext) {
    const data = await request.validateUsing(storeProviderRouteValidator)

    const existing = await ProviderRoute.query()
      .where('provider_id', params.providerId)
      .where('mobile_operator_id', data.mobileOperatorId)
      .first()

    if (existing) {
      session.flash('errors', { route: 'This mobile operator is already linked to this provider' })
      return response.redirect().back()
    }

    await ProviderRoute.create({
      providerId: params.providerId,
      mobileOperatorId: data.mobileOperatorId,
      priority: data.priority ?? 99,
      isActive: true,
    })

    session.flash('success', 'Mobile operator added to provider')
    return response.redirect().back()
  }

  /**
   * Remove a mobile operator from a provider (delete the route).
   */
  async destroyProviderRoute({ params, response, session }: HttpContext) {
    await ProviderRoute.query()
      .where('id', params.routeId)
      .delete()

    session.flash('success', 'Mobile operator removed from provider')
    return response.redirect().back()
  }

  /**
   * GET /api/v1/providers/:id — Show a single provider (API).
   */
  async show({ params, response }: HttpContext) {
    const provider = await Provider.query()
      .where('id', params.id)
      .preload('routes')
      .preload('transactions')
      .first()

    if (!provider) {
      return response.status(404).json({ message: 'Provider not found' })
    }

    return response.status(200).json(provider)
  }

  /**
   * PUT /api/v1/providers/:id — Update provider config/status.
   * This is how the dashboard activates/deactivates and configures providers.
   */
  async update({ params, request, response }: HttpContext) {
    const provider = await Provider.find(params.id)
    if (!provider) {
      return response.status(404).json({ message: 'Provider not found' })
    }
    const data = await request.validateUsing(updateProviderValidator)

    if (data.name) provider.name = data.name
    if (data.status) provider.status = data.status
    if (data.config) provider.config = data.config

    await provider.save()
    return response.status(200).json(provider)
  }

  /**
   * POST /api/v1/providers/:id/test — Test connection to a provider.
   */
  async testConnection({ params, response }: HttpContext) {
    const provider = await Provider.find(params.id)
    if (!provider) {
      return response.status(404).json({ message: 'Provider not found' })
    }

    return response.status(200).json({
      ok: true,
      message: `Connection to ${provider.name} successful (mock)`,
    })
  }

  /**
   * GET /api/v1/providers/:id/stats — Get transaction stats for a provider.
   */
  async stats({ params, response }: HttpContext) {
    const provider = await Provider.find(params.id)
    if (!provider) {
      return response.status(404).json({ message: 'Provider not found' })
    }

    const [totalCount, volume, successCount] = await Promise.all([
      db.from('transactions').where('provider_id', provider.id).count('* as count').first(),
      db
        .from('transactions')
        .where('provider_id', provider.id)
        .where('status', 'completed')
        .sum('amount as total')
        .first(),
      db
        .from('transactions')
        .where('provider_id', provider.id)
        .where('status', 'completed')
        .count('* as count')
        .first(),
    ])

    const totalTx = Number(totalCount?.count ?? 0)
    const rate = totalTx > 0 ? ((Number(successCount?.count ?? 0) / totalTx) * 100).toFixed(2) : '0'

    return response.status(200).json({
      totalTransactions: totalTx,
      totalVolume: Number(volume?.total ?? 0),
      successRate: `${rate}%`,
    })
  }
}
