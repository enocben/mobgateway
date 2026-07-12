import type { HttpContext } from '@adonisjs/core/http'
import MobileOperator from '#models/mobile_operator'
import OperatorPrefix from '#models/operator_prefix'
import MobileOperatorTransformer from '#transformers/mobile_operator_transformer'
import {
  createMobileOperatorValidator,
  updateMobileOperatorValidator,
} from '#validators/mobile_operator'
import Country from '#models/country'

export default class MobileOperatorsController {
  async index({ params, inertia }: HttpContext) {
    const applicationId = params.id

    const mobileOperators = await MobileOperator.query()
      .where('applicationId', applicationId)
      .preload('country')
      .preload('prefixes')

    return inertia.render('admin/MobileOperators/List', {
      mobileOperators: MobileOperatorTransformer.transform(mobileOperators),
    })
  }

  async store({ params, request, response, session }: HttpContext) {
    const applicationId = params.id
    const data = await request.validateUsing(createMobileOperatorValidator)
    const country = await Country.findBy('code', data.countryCode)

    if (!country)
      return response.abort("Country not found", 404)


    const operator = await MobileOperator.create({
      name: data.name,
      logoUrl: data.logoUrl ?? null,
      isEnabled: true,
      applicationId,
      countryId: country.id
    })

    // Créer les préfixes associés
    for (const prefix of data.prefixes) {
      await OperatorPrefix.create({
        mobileOperatorId: operator.id,
        prefix,
      })
    }

    session.flash('success', 'Mobile operator created')
    return response.redirect().back()
  }

  async update({ params, request, response, session }: HttpContext) {
    const data = await request.validateUsing(updateMobileOperatorValidator)

    const operator = await MobileOperator.query()
      .where('applicationId', params.id)
      .where('id', params.operatorId)
      .first()

    if (!operator) {
      session.flash('errors', { mobileOperator: 'Mobile operator not found' })
      return response.redirect().back()
    }


    if (data.name !== undefined) operator.name = data.name
    if (data.countryCode){
      const country = await Country.findBy('code', data.countryCode)
      if (country)
        operator.countryId = country.id
    }
    if (data.logoUrl !== undefined) operator.logoUrl = data.logoUrl
    if (data.isEnabled !== undefined) operator.isEnabled = data.isEnabled

    await operator.save()

    // Mise à jour des préfixes : suppression + recréation
    if (data.prefixes !== undefined) {
      await OperatorPrefix.query().where('mobileOperatorId', operator.id).delete()
      for (const prefix of data.prefixes) {
        await OperatorPrefix.create({
          mobileOperatorId: operator.id,
          prefix,
        })
      }
    }

    session.flash('success', 'Mobile operator updated')
    return response.redirect().back()
  }

  async destroy({ params, response, session }: HttpContext) {
    const operator = await MobileOperator.query()
      .where('applicationId', params.id)
      .where('id', params.operatorId)
      .first()

    if (!operator) {
      session.flash('errors', { mobileOperator: 'Mobile operator not found' })
      return response.redirect().back()
    }

    await operator.delete()
    session.flash('success', 'Mobile operator deleted')
    return response.redirect().back()
  }
}
