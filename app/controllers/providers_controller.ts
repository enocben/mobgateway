import type { HttpContext } from '@adonisjs/core/http'
import Provider from '#models/provider'
import ProviderRoute from '#models/provider_route'
import MobileOperator from '#models/mobile_operator'
import db from '@adonisjs/lucid/services/db'
import ProviderTransformer from '#transformers/provider_transformer'
import Country from '#models/country'
import CountryTransformer from '#transformers/country_transformer'
import MobileOperatorTransformer from '#transformers/mobile_operator_transformer'

export default class ProvidersController {
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
    const applicationId = params.id
    const provider = await Provider.query()
      .where('id', params.providerId)
      .preload('routes', (q) =>
        q
          .preload('mobileOperator')
          .orderBy('priority', 'asc')
      )
      .preload('transactions', (q) =>
        q.preload('application').orderBy('createdAt', 'desc').limit(20)
      )
      .preload('countries', (q) => q.where('applicationId', applicationId))
      .firstOrFail()

    // Available countries (not yet linked)
    const linkedCountryIds = provider.countries.map((c) => c.id)
    const availableCountries = await Country.query()
      .where('application_id', applicationId)
      .whereNotIn('id', linkedCountryIds.length > 0 ? linkedCountryIds : [''])
      .orderBy('name', 'asc')

    // Available mobile operators: only from countries linked to this provider
    const linkedCountryCodes = provider.countries.map((c) => c.id).filter((v) => v !== null)

    const availableOperators = await MobileOperator.query()
      .where('application_id', applicationId)
      .whereIn('country_id', linkedCountryCodes)
      .preload('country')
      .orderBy('name', 'asc')

    const [txStats] = await Promise.all([
      db
        .from('transactions')
        .where('provider_id', provider.id)
        .select(
          db.raw('COUNT(*)::int as total'),
          db.raw(
            "COALESCE(SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END), 0) as volume"
          ),
          db.raw("COALESCE(SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END), 0) as completed")
        )
        .first(),
    ])

    const totalTx = Number(txStats?.total ?? 0)
    const completed = Number(txStats?.completed ?? 0)
    const successRate = totalTx > 0 ? Number(((completed / totalTx) * 100).toFixed(1)) : 0

    return inertia.render('admin/Providers/Detail', {
      provider: ProviderTransformer.transform(provider),
      availableCountries: CountryTransformer.transform(availableCountries),
      availableOperators: MobileOperatorTransformer.transform(availableOperators),
      stats: {
        totalTransactions: totalTx,
        totalVolume: Number(txStats?.volume ?? 0),
        successRate,
      },
    })
  }

  /**
   * Detach a country from a provider (scoped to current application).
   */
  async providersDestroyCountry({ params, response, session }: HttpContext) {
    const country = await Country.findOrFail(params.countryId)
    const provider = await Provider.query()
      .where('id', params.providerId)
      .firstOrFail()

    await provider.related('countries').detach([country.id])

    session.flash('success', `Country ${country.name} removed from provider`)
    return response.redirect().back()
  }

  /**
   * Attach a country to a provider (scoped to current application).
   */
  async createProvider({ params, response, session }: HttpContext) {
    const provider = await Provider.findOrFail(params.providerId)
    const country = await Country.findOrFail(params.countryId)

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
    const { mobileOperatorId, priority } = request.only(['mobileOperatorId', 'priority'])

    // Check if already routed for this app
    const existing = await ProviderRoute.query()
      .where('provider_id', params.providerId)
      .where('mobileOperator_id', mobileOperatorId)
      .first()

    if (existing) {
      session.flash('errors', { route: 'This mobile operator is already linked to this provider' })
      return response.redirect().back()
    }

    await ProviderRoute.create({
      providerId: params.providerId,
      mobileOperatorId,
      priority: priority ? Number(priority) : 99,
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

    const { name, status, config } = request.only(['name', 'status', 'config'])

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return response.status(422).json({
          message: 'Validation failed',
          errors: { name: 'Name cannot be empty' },
        })
      }
      provider.name = name
    }

    if (status !== undefined) {
      if (!['active', 'inactive'].includes(status)) {
        return response.status(422).json({
          message: 'Validation failed',
          errors: { status: 'Status must be active or inactive' },
        })
      }
      provider.status = status
    }

    if (config !== undefined) {
      provider.config = config
    }

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
