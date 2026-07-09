import type { HttpContext } from '@adonisjs/core/http'
import Country from '#models/country'

export default class CountriesController {
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)
    const search = request.input('search')

    const query = Country.query().preload('currency')

    if (search) {
      query.where((q) => {
        q.where('name', 'ilike', `%${search}%`)
          .orWhere('code', 'ilike', `%${search}%`)
      })
    }

    const countries = await query.orderBy('name', 'asc').paginate(page, limit)
    return response.status(200).json(countries)
  }

  async store({ request, response }: HttpContext) {
    const { code, name, currencyCode, phonePrefix } = request.only(['code', 'name', 'currencyCode', 'phonePrefix'])

    if (!code || !name || !currencyCode || !phonePrefix) {
      return response.status(422).json({
        message: 'Validation failed',
        errors: {
          code: !code ? 'Country code is required' : undefined,
          name: !name ? 'Name is required' : undefined,
          currencyCode: !currencyCode ? 'Currency code is required' : undefined,
          phonePrefix: !phonePrefix ? 'Phone prefix is required' : undefined,
        },
      })
    }

    if (typeof code !== 'string' || code.length !== 2) {
      return response.status(422).json({
        message: 'Validation failed',
        errors: { code: 'Country code must be exactly 2 characters' },
      })
    }

    const country = await Country.create({
      code: code.toUpperCase(),
      name,
      currencyCode,
      phonePrefix,
    })

    return response.status(201).json(country)
  }

  async show({ params, response }: HttpContext) {
    const country = await Country.query()
      .where('code', params.code)
      .preload('currency')
      .preload('mobileOperators')
      .first()

    if (!country) {
      return response.status(404).json({ message: 'Country not found' })
    }

    return response.status(200).json(country)
  }

  async update({ params, request, response }: HttpContext) {
    const country = await Country.find(params.code)
    if (!country) {
      return response.status(404).json({ message: 'Country not found' })
    }

    const { name, currencyCode, phonePrefix } = request.only(['name', 'currencyCode', 'phonePrefix'])

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return response.status(422).json({
          message: 'Validation failed',
          errors: { name: 'Name cannot be empty' },
        })
      }
      country.name = name
    }

    if (currencyCode !== undefined) country.currencyCode = currencyCode
    if (phonePrefix !== undefined) country.phonePrefix = phonePrefix

    await country.save()
    return response.status(200).json(country)
  }

  async destroy({ params, response }: HttpContext) {
    const country = await Country.find(params.code)
    if (!country) {
      return response.status(404).json({ message: 'Country not found' })
    }

    await country.delete()
    return response.status(200).json({ message: 'Country deleted' })
  }
}
