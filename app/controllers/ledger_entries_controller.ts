import type { HttpContext } from '@adonisjs/core/http'
import LedgerEntry from '#models/ledger_entry'

export default class LedgerEntriesController {
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 50)
    const transactionId = request.input('transaction_id')
    const accountId = request.input('account_id')
    const direction = request.input('direction')

    const query = LedgerEntry.query()
      .preload('transaction')
      .preload('account')

    if (transactionId) query.where('transaction_id', Number(transactionId))
    if (accountId) query.where('account_id', Number(accountId))
    if (direction) query.where('direction', direction)

    const entries = await query.orderBy('created_at', 'desc').paginate(page, limit)
    return response.status(200).json(entries)
  }

  async show({ params, response }: HttpContext) {
    const entry = await LedgerEntry.query()
      .where('id', params.id)
      .preload('transaction')
      .preload('account')
      .first()

    if (!entry) {
      return response.status(404).json({ message: 'Ledger entry not found' })
    }

    return response.status(200).json(entry)
  }
}
