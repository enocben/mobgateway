import type { HttpContext } from '@adonisjs/core/http'
import Provider from '#models/provider'
import db from '@adonisjs/lucid/services/db'

export default class ProvidersController {
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)
    const search = request.input('search')
    const status = request.input('status')
    const type = request.input('type')

    const query = Provider.query()

    if (search) {
      query.where((q) => {
        q.where('name', 'ilike', `%${search}%`)
          .orWhere('code', 'ilike', `%${search}%`)
      })
    }

    if (status) query.where('status', status)
    if (type) query.where('type', type)

    const providers = await query.orderBy('name', 'asc').paginate(page, limit)
    return response.status(200).json(providers)
  }

  async store({ request, response }: HttpContext) {
    const { name, code, type, config } = request.only(['name', 'code', 'type', 'config'])

    if (!name || !code) {
      return response.status(422).json({
        message: 'Validation failed',
        errors: {
          name: !name ? 'Name is required' : undefined,
          code: !code ? 'Code is required' : undefined,
        },
      })
    }

    if (type && !['direct', 'aggregator'].includes(type)) {
      return response.status(422).json({
        message: 'Validation failed',
        errors: { type: 'Type must be direct or aggregator' },
      })
    }

    const provider = await Provider.create({
      name,
      code,
      type: type || 'direct',
      status: 'active',
      config: config || {},
    })

    return response.status(201).json(provider)
  }

  async show({ params, response }: HttpContext) {
    const provider = await Provider.query()
      .where('id', params.id)
      .preload('providerRoutes', (q) => q.preload('mobileOperator'))
      .first()

    if (!provider) {
      return response.status(404).json({ message: 'Provider not found' })
    }

    return response.status(200).json(provider)
  }

  async update({ params, request, response }: HttpContext) {
    const provider = await Provider.find(params.id)
    if (!provider) {
      return response.status(404).json({ message: 'Provider not found' })
    }

    const { name, code, type, status, config } = request.only(['name', 'code', 'type', 'status', 'config'])

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return response.status(422).json({
          message: 'Validation failed',
          errors: { name: 'Name cannot be empty' },
        })
      }
      provider.name = name
    }

    if (code !== undefined) provider.code = code
    if (type !== undefined) {
      if (!['direct', 'aggregator'].includes(type)) {
        return response.status(422).json({
          message: 'Validation failed',
          errors: { type: 'Type must be direct or aggregator' },
        })
      }
      provider.type = type
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
    if (config !== undefined) provider.config = config

    await provider.save()
    return response.status(200).json(provider)
  }

  async destroy({ params, response }: HttpContext) {
    const provider = await Provider.find(params.id)
    if (!provider) {
      return response.status(404).json({ message: 'Provider not found' })
    }

    await provider.delete()
    return response.status(200).json({ message: 'Provider deleted' })
  }

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
