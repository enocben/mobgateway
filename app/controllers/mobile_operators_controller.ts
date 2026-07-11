import type { HttpContext } from '@adonisjs/core/http'
import MobileOperator from '#models/mobile_operator'
import MobileOperatorTransformer from '#transformers/mobile_operator_transformer'

export default class MobileOperatorsController {
  async index({ params, inertia }: HttpContext) {
    const applicationId = params.id

    const mobileOperators = await MobileOperator.query()
      .where('applicationId', applicationId)
      .preload('country')
      .preload('prefixes')

    return inertia.render('admin/MobileOperators/List', {
      mobileOperators: MobileOperatorTransformer.transform(mobileOperators)
    })
  }

  async store({ request, response }: HttpContext) {
    const { countryCode, name, logoUrl, applicationId } = request.only(['countryCode', 'name', 'logoUrl', 'applicationId'])

    if (!countryCode || !name || !applicationId) {
      return response.status(422).json({
        message: 'Validation failed',
        errors: {
          countryCode: !countryCode ? 'Country code is required' : undefined,
          name: !name ? 'Name is required' : undefined,
          applicationId: !applicationId ? 'Application ID is required' : undefined,
        },
      })
    }

    const operator = await MobileOperator.create({
      countryCode,
      name,
      logoUrl: logoUrl || null,
      isEnabled: true,
      applicationId,
    })

    return response.status(201).json(operator)
  }

  async show({ params, response }: HttpContext) {
    const operator = await MobileOperator.query()
      .where('id', params.id)
      .preload('country')
      .preload('prefixes')
      .first()

    if (!operator) {
      return response.status(404).json({ message: 'Mobile operator not found' })
    }

    return response.status(200).json(operator)
  }

  async update({ params, request, response }: HttpContext) {
    const operator = await MobileOperator.find(params.id)
    if (!operator) {
      return response.status(404).json({ message: 'Mobile operator not found' })
    }

    const { countryCode, name, logoUrl, isEnabled } = request.only(['countryCode', 'name', 'logoUrl', 'isEnabled'])

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return response.status(422).json({
          message: 'Validation failed',
          errors: { name: 'Name cannot be empty' },
        })
      }
      operator.name = name
    }

    if (countryCode !== undefined) operator.countryCode = countryCode
    if (logoUrl !== undefined) operator.logoUrl = logoUrl
    if (isEnabled !== undefined) operator.isEnabled = Boolean(isEnabled)

    await operator.save()
    return response.status(200).json(operator)
  }

  async destroy({ params, response }: HttpContext) {
    const operator = await MobileOperator.find(params.id)
    if (!operator) {
      return response.status(404).json({ message: 'Mobile operator not found' })
    }

    await operator.delete()
    return response.status(200).json({ message: 'Mobile operator deleted' })
  }
}
