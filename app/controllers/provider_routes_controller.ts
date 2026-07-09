import type { HttpContext } from '@adonisjs/core/http'
import ProviderRoute from '#models/provider_route'

export default class ProviderRoutesController {
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)
    const mobileOperatorId = request.input('mobile_operator_id')
    const providerId = request.input('provider_id')

    const query = ProviderRoute.query()
      .preload('mobileOperator')
      .preload('provider')

    if (mobileOperatorId) query.where('mobile_operator_id', Number(mobileOperatorId))
    if (providerId) query.where('provider_id', Number(providerId))

    const routes = await query.orderBy('priority', 'asc').paginate(page, limit)
    return response.status(200).json(routes)
  }

  async store({ request, response }: HttpContext) {
    const { mobileOperatorId, providerId, priority, isActive } = request.only([
      'mobileOperatorId', 'providerId', 'priority', 'isActive',
    ])

    if (!mobileOperatorId || !providerId) {
      return response.status(422).json({
        message: 'Validation failed',
        errors: {
          mobileOperatorId: !mobileOperatorId ? 'Mobile operator ID is required' : undefined,
          providerId: !providerId ? 'Provider ID is required' : undefined,
        },
      })
    }

    const route = await ProviderRoute.create({
      mobileOperatorId: Number(mobileOperatorId),
      providerId: Number(providerId),
      priority: priority ?? 1,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    })

    return response.status(201).json(route)
  }

  async show({ params, response }: HttpContext) {
    const route = await ProviderRoute.query()
      .where('id', params.id)
      .preload('mobileOperator')
      .preload('provider')
      .first()

    if (!route) {
      return response.status(404).json({ message: 'Provider route not found' })
    }

    return response.status(200).json(route)
  }

  async update({ params, request, response }: HttpContext) {
    const route = await ProviderRoute.find(params.id)
    if (!route) {
      return response.status(404).json({ message: 'Provider route not found' })
    }

    const { mobileOperatorId, providerId, priority, isActive } = request.only([
      'mobileOperatorId', 'providerId', 'priority', 'isActive',
    ])

    if (mobileOperatorId !== undefined) route.mobileOperatorId = Number(mobileOperatorId)
    if (providerId !== undefined) route.providerId = Number(providerId)
    if (priority !== undefined) route.priority = Number(priority)
    if (isActive !== undefined) route.isActive = Boolean(isActive)

    await route.save()
    return response.status(200).json(route)
  }

  async destroy({ params, response }: HttpContext) {
    const route = await ProviderRoute.find(params.id)
    if (!route) {
      return response.status(404).json({ message: 'Provider route not found' })
    }

    await route.delete()
    return response.status(200).json({ message: 'Provider route deleted' })
  }
}
