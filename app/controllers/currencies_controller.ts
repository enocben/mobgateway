import type { HttpContext } from '@adonisjs/core/http'
import Currency from '#models/currency'

export default class CurrenciesController {
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)
    const search = request.input('search')
    const applicationId = request.input('application_id')

    const query = Currency.query()

    if (applicationId) {
      query.where('application_id', applicationId)
    }

    if (search) {
      query.where((q) => {
        q.where('code', 'ilike', `%${search}%`)
          .orWhere('symbol', 'ilike', `%${search}%`)
      })
    }

    const currencies = await query.orderBy('code', 'asc').paginate(page, limit)
    return response.status(200).json(currencies)
  }

  async store({ request, response }: HttpContext) {
    const { code, name, symbol, decimals, applicationId } = request.only(['code', 'name', 'symbol', 'decimals', 'applicationId'])

    if (!code || !name || !symbol || !applicationId) {
      return response.status(422).json({
        message: 'Validation failed',
        errors: {
          code: !code ? 'Currency code is required' : undefined,
          name: !name ? 'Name is required' : undefined,
          symbol: !symbol ? 'Symbol is required' : undefined,
          applicationId: !applicationId ? 'Application ID is required' : undefined,
        },
      })
    }

    if (typeof code !== 'string' || code.length !== 3) {
      return response.status(422).json({
        message: 'Validation failed',
        errors: { code: 'Currency code must be exactly 3 characters' },
      })
    }

    const currency = await Currency.create({
      code: code.toUpperCase(),
      name,
      symbol,
      decimals: decimals ?? 2,
      isActive: true,
      applicationId,
    })

    return response.status(201).json(currency)
  }

  async show({ params, response }: HttpContext) {
    const currency = await Currency.findBy('code', params.code)
    if (!currency) {
      return response.status(404).json({ message: 'Currency not found' })
    }

    return response.status(200).json(currency)
  }

  async update({ params, request, response }: HttpContext) {
    const currency = await Currency.findBy('code', params.code)
    if (!currency) {
      return response.status(404).json({ message: 'Currency not found' })
    }

    const { name, symbol, decimals, isActive } = request.only(['name', 'symbol', 'decimals', 'isActive'])

    if (name !== undefined) currency.name = name
    if (symbol !== undefined) currency.symbol = symbol
    if (decimals !== undefined) currency.decimals = Number(decimals)
    if (isActive !== undefined) currency.isActive = Boolean(isActive)

    await currency.save()
    return response.status(200).json(currency)
  }

  async destroy({ params, response }: HttpContext) {
    const currency = await Currency.findBy('code', params.code)
    if (!currency) {
      return response.status(404).json({ message: 'Currency not found' })
    }

    currency.isActive = false
    await currency.save()

    return response.status(200).json({ message: 'Currency deactivated' })
  }
}
