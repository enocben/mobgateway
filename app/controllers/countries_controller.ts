import type { HttpContext } from '@adonisjs/core/http'
import Country from '#models/country'
import CountryTransformer from '#transformers/country_transformer'

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
