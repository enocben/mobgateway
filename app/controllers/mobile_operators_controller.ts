import type { HttpContext } from '@adonisjs/core/http'
import MobileOperator from '#models/mobile_operator'
import OperatorPrefix from '#models/operator_prefix'
import MobileOperatorTransformer from '#transformers/mobile_operator_transformer'
import {
  createMobileOperatorValidator,
  updateMobileOperatorValidator,
} from '#validators/mobile_operator'

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
    const inputs = request.only(['countryCode', 'name', 'logoUrl'])
    const prefixes = request.input('prefixes') ?? []

    const [error, data] = await createMobileOperatorValidator.tryValidate({
      ...inputs,
      applicationId,
      prefixes: Array.isArray(prefixes) ? prefixes : [prefixes],
    })

    if (error) {
      session.flash('errors', {
        mobileOperator: error.messages,
      })
      return response.redirect().back()
    }

    const operator = await MobileOperator.create({
      countryCode: data.countryCode,
      name: data.name,
      logoUrl: data.logoUrl ?? null,
      isEnabled: true,
      applicationId,
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
    const operator = await MobileOperator.query()
      .where('applicationId', params.id)
      .where('id', params.operatorId)
      .first()

    if (!operator) {
      session.flash('errors', { mobileOperator: 'Mobile operator not found' })
      return response.redirect().back()
    }

    const [error, data] = await updateMobileOperatorValidator.tryValidate({
      ...request.only(['countryCode', 'name', 'logoUrl', 'isEnabled']),
      prefixes: request.input('prefixes'),
    })

    if (error) {
      session.flash('errors', {
        mobileOperator: error.messages,
      })
      return response.redirect().back()
    }

    if (data.name !== undefined) operator.name = data.name
    if (data.countryCode !== undefined) operator.countryCode = data.countryCode
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
