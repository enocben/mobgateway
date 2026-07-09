import type { HttpContext } from '@adonisjs/core/http'
import OperatorPrefix from '#models/operator_prefix'

export default class OperatorPrefixesController {
  async index({ params, request, response }: HttpContext) {
    const mobileOperatorId = Number(params.mobile_operator_id)
    const page = request.input('page', 1)
    const limit = request.input('limit', 50)

    const prefixes = await OperatorPrefix.query()
      .where('mobile_operator_id', mobileOperatorId)
      .orderBy('prefix', 'asc')
      .paginate(page, limit)

    return response.status(200).json(prefixes)
  }

  async store({ params, request, response }: HttpContext) {
    const mobileOperatorId = Number(params.mobile_operator_id)
    const { prefix } = request.only(['prefix'])

    if (!prefix) {
      return response.status(422).json({
        message: 'Validation failed',
        errors: { prefix: 'Prefix is required' },
      })
    }

    const operatorPrefix = await OperatorPrefix.create({
      mobileOperatorId,
      prefix: prefix.trim(),
    })

    return response.status(201).json(operatorPrefix)
  }

  async destroy({ params, response }: HttpContext) {
    const operatorPrefix = await OperatorPrefix.find(params.id)
    if (!operatorPrefix) {
      return response.status(404).json({ message: 'Prefix not found' })
    }

    await operatorPrefix.delete()
    return response.status(200).json({ message: 'Prefix deleted' })
  }
}
