import type { HttpContext } from '@adonisjs/core/http'
import Commission from '#models/commission'

export default class CommissionsController {
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)

    const query = Commission.query()
      .preload('application')
      .preload('country')
      .preload('currency')
      .preload('provider')
      .preload('mobileOperator')

    const commissions = await query.orderBy('created_at', 'desc').paginate(page, limit)
    return response.status(200).json(commissions)
  }

  async store({ request, response }: HttpContext) {
    const data = request.only([
      'applicationId', 'countryCode', 'currencyCode', 'providerId',
      'mobileOperatorId', 'type', 'value', 'minAmount', 'maxAmount',
    ])

    if (!data.type || data.value === undefined) {
      return response.status(422).json({
        message: 'Validation failed',
        errors: {
          type: !data.type ? 'Type is required' : undefined,
          value: data.value === undefined ? 'Value is required' : undefined,
        },
      })
    }

    if (!['fixed', 'percentage'].includes(data.type)) {
      return response.status(422).json({
        message: 'Validation failed',
        errors: { type: 'Type must be fixed or percentage' },
      })
    }

    const commission = await Commission.create({
      applicationId: data.applicationId ? Number(data.applicationId) : null,
      countryCode: data.countryCode || null,
      currencyCode: data.currencyCode || null,
      providerId: data.providerId ? Number(data.providerId) : null,
      mobileOperatorId: data.mobileOperatorId ? Number(data.mobileOperatorId) : null,
      type: data.type,
      value: Number(data.value),
      minAmount: data.minAmount ? Number(data.minAmount) : null,
      maxAmount: data.maxAmount ? Number(data.maxAmount) : null,
    })

    return response.status(201).json(commission)
  }

  async show({ params, response }: HttpContext) {
    const commission = await Commission.query()
      .where('id', params.id)
      .preload('application')
      .preload('country')
      .preload('currency')
      .preload('provider')
      .preload('mobileOperator')
      .first()

    if (!commission) {
      return response.status(404).json({ message: 'Commission not found' })
    }

    return response.status(200).json(commission)
  }

  async update({ params, request, response }: HttpContext) {
    const commission = await Commission.find(params.id)
    if (!commission) {
      return response.status(404).json({ message: 'Commission not found' })
    }

    const data = request.only([
      'applicationId', 'countryCode', 'currencyCode', 'providerId',
      'mobileOperatorId', 'type', 'value', 'minAmount', 'maxAmount',
    ])

    if (data.type !== undefined) {
      if (!['fixed', 'percentage'].includes(data.type)) {
        return response.status(422).json({
          message: 'Validation failed',
          errors: { type: 'Type must be fixed or percentage' },
        })
      }
      commission.type = data.type
    }

    if (data.applicationId !== undefined) commission.applicationId = data.applicationId ? Number(data.applicationId) : null
    if (data.countryCode !== undefined) commission.countryCode = data.countryCode || null
    if (data.currencyCode !== undefined) commission.currencyCode = data.currencyCode || null
    if (data.providerId !== undefined) commission.providerId = data.providerId ? Number(data.providerId) : null
    if (data.mobileOperatorId !== undefined) commission.mobileOperatorId = data.mobileOperatorId ? Number(data.mobileOperatorId) : null
    if (data.value !== undefined) commission.value = Number(data.value)
    if (data.minAmount !== undefined) commission.minAmount = data.minAmount ? Number(data.minAmount) : null
    if (data.maxAmount !== undefined) commission.maxAmount = data.maxAmount ? Number(data.maxAmount) : null

    await commission.save()
    return response.status(200).json(commission)
  }

  async destroy({ params, response }: HttpContext) {
    const commission = await Commission.find(params.id)
    if (!commission) {
      return response.status(404).json({ message: 'Commission not found' })
    }

    await commission.delete()
    return response.status(200).json({ message: 'Commission deleted' })
  }
}
