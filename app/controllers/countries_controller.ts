import type { HttpContext } from '@adonisjs/core/http'
import Country from '#models/country'
import CountryTransformer from '#transformers/country_transformer'
import {getCountryData} from "countries-list";

export default class CountriesController {
  async countries({ inertia, params }: HttpContext) {
    const applicationId = params.id
    const countries = await Country.query()
      .where('applicationId', applicationId)
      .preload('application')

    return inertia.render('admin/Countries/List', {
      countries: CountryTransformer.transform(countries),
    })
  }

  async create({ params, response }: HttpContext) {
    const countryIso2 = params.iso2
    const appId = params.id
    const data = getCountryData(countryIso2)

    if (data.iso3 === undefined || !appId){
      return response.abort("Country not found", 404)
    }

    await Country.create({
      name: data.name,
      code: data.iso2,
      currencyCode: data.currency[0],
      phonePrefix: data.phone[0].toString(),
      applicationId: appId
    })

    return response.redirect().back()
  }

  async destroy({ params, response, session }: HttpContext) {
    const applicationId = params.id
    const country = await Country.query()
      .where('applicationId', applicationId)
      .where('id', params.countryId)
      .first()

    if (!country) {
      session.flash('success', 'Country not found')
    } else {
      await country.delete()
      session.flash('success', 'Country delete successfully')
    }
    return response.redirect().back()
  }
}
