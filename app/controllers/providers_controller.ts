import type { HttpContext } from '@adonisjs/core/http'
import Provider from '#models/provider'
import db from '@adonisjs/lucid/services/db'
import ProviderTransformer from '#transformers/provider_transformer'

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
      db.from('transactions')
        .where('provider_id', provider.id)
        .where('status', 'completed')
        .sum('amount as total')
        .first(),
      db.from('transactions')
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
