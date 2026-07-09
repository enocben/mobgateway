import type { HttpContext } from '@adonisjs/core/http'
import ReconciliationEntry from '#models/reconciliation_entry'
import ReconciliationService from '#services/reconciliation_service'

export default class ReconciliationController {
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 50)
    const status = request.input('status')
    const source = request.input('source')

    const query = ReconciliationEntry.query().preload('transaction')

    if (status) query.where('status', status)
    if (source) query.where('source', source)

    const entries = await query.orderBy('created_at', 'desc').paginate(page, limit)
    return response.status(200).json(entries)
  }

  async show({ params, response }: HttpContext) {
    const entry = await ReconciliationEntry.query()
      .where('id', params.id)
      .preload('transaction')
      .first()

    if (!entry) {
      return response.status(404).json({ message: 'Reconciliation entry not found' })
    }

    return response.status(200).json(entry)
  }

  async upload({ request, response }: HttpContext) {
    const file = request.file('file')
    if (!file) {
      return response.status(422).json({
        message: 'Validation failed',
        errors: { file: 'CSV file is required' },
      })
    }

    try {
      const service = new ReconciliationService()
      const result = await service.processStatement(file)
      return response.status(200).json(result)
    } catch (error) {
      return response.status(500).json({ message: 'Failed to process statement', error: error.message })
    }
  }

  async match({ request, response }: HttpContext) {
    const { reconciliationEntryId, transactionId } = request.only(['reconciliationEntryId', 'transactionId'])

    if (!reconciliationEntryId || !transactionId) {
      return response.status(422).json({
        message: 'Validation failed',
        errors: {
          reconciliationEntryId: !reconciliationEntryId ? 'Reconciliation entry ID is required' : undefined,
          transactionId: !transactionId ? 'Transaction ID is required' : undefined,
        },
      })
    }

    try {
      const service = new ReconciliationService()
      const result = await service.manualMatch(Number(reconciliationEntryId), Number(transactionId))
      return response.status(200).json(result)
    } catch (error) {
      return response.status(500).json({ message: 'Failed to match entries', error: error.message })
    }
  }

  async runReconciliation({ request, response }: HttpContext) {
    const { dateFrom, dateTo } = request.only(['dateFrom', 'dateTo'])

    try {
      const service = new ReconciliationService()
      const result = await service.runAutoReconciliation(dateFrom, dateTo)
      return response.status(200).json(result)
    } catch (error) {
      return response.status(500).json({ message: 'Reconciliation failed', error: error.message })
    }
  }
}
