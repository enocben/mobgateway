import type { HttpContext } from '@adonisjs/core/http'
import Account from '#models/account'

export default class AccountsController {
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)
    const applicationId = request.input('application_id')
    const accountType = request.input('account_type')
    const currency = request.input('currency')

    const query = Account.query().preload('application')

    if (applicationId) query.where('application_id', Number(applicationId))
    if (accountType) query.where('account_type', accountType)
    if (currency) query.where('currency', currency)

    const accounts = await query.orderBy('created_at', 'desc').paginate(page, limit)
    return response.status(200).json(accounts)
  }

  async show({ params, response }: HttpContext) {
    const account = await Account.query()
      .where('id', params.id)
      .preload('application')
      .first()

    if (!account) {
      return response.status(404).json({ message: 'Account not found' })
    }

    return response.status(200).json(account)
  }
}
