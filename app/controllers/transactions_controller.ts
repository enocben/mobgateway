import type { HttpContext } from '@adonisjs/core/http'
import Transaction from '#models/transaction'
import TransactionEvent from '#models/transaction_event'
import db from '@adonisjs/lucid/services/db'
import { randomUUID } from 'node:crypto'

export default class TransactionsController {
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)
    const { status, txType, applicationId, providerId, currency, dateFrom, dateTo } = request.only([
      'status', 'txType', 'applicationId', 'providerId', 'currency', 'dateFrom', 'dateTo',
    ])

    const query = Transaction.query()
      .preload('application')
      .preload('provider')
      .preload('mobileOperator')
      .preload('events')

    if (status) query.where('status', status)
    if (txType) query.where('tx_type', txType)
    if (applicationId) query.where('application_id', Number(applicationId))
    if (providerId) query.where('provider_id', Number(providerId))
    if (currency) query.where('currency', currency)

    if (dateFrom) query.where('created_at', '>=', dateFrom)
    if (dateTo) query.where('created_at', '<=', dateTo)

    const transactions = await query.orderBy('created_at', 'desc').paginate(page, limit)
    return response.status(200).json(transactions)
  }

  async store({ request, response }: HttpContext) {
    const data = request.only([
      'applicationId', 'txType', 'msisdn', 'amount', 'currency',
      'idempotencyKey', 'mobileOperatorId', 'metadata',
    ])

    if (!data.applicationId || !data.txType || !data.msisdn || !data.amount || !data.currency) {
      return response.status(422).json({
        message: 'Validation failed',
        errors: {
          applicationId: !data.applicationId ? 'Application ID is required' : undefined,
          txType: !data.txType ? 'Transaction type is required' : undefined,
          msisdn: !data.msisdn ? 'MSISDN is required' : undefined,
          amount: !data.amount ? 'Amount is required' : undefined,
          currency: !data.currency ? 'Currency is required' : undefined,
        },
      })
    }

    if (!['collection', 'payout'].includes(data.txType)) {
      return response.status(422).json({
        message: 'Validation failed',
        errors: { txType: 'Type must be collection or payout' },
      })
    }

    const idempotencyKey = data.idempotencyKey || randomUUID()

    // Check for existing transaction with same idempotency key
    const existing = await Transaction.findBy('idempotency_key', idempotencyKey)
    if (existing) {
      return response.status(200).json({
        message: 'Transaction already exists',
        transaction: existing,
      })
    }

    const reference = `TXN-${randomUUID().slice(0, 12).toUpperCase()}`

    const transaction = await Transaction.create({
      applicationId: Number(data.applicationId),
      mobileOperatorId: data.mobileOperatorId ? Number(data.mobileOperatorId) : null,
      idempotencyKey,
      txType: data.txType,
      msisdn: data.msisdn,
      reference,
      amount: Number(data.amount),
      currency: data.currency,
      fxRate: 1.0,
      status: 'pending',
      metadata: data.metadata || {},
    })

    // Create initial event
    await TransactionEvent.create({
      transactionId: transaction.id,
      fromStatus: null,
      toStatus: 'pending',
      payload: {},
    })

    await transaction.load('events')
    return response.status(201).json(transaction)
  }

  async show({ params, response }: HttpContext) {
    const transaction = await Transaction.query()
      .where('id', params.id)
      .preload('application')
      .preload('provider')
      .preload('mobileOperator')
      .preload('providerRoute')
      .preload('events')
      .first()

    if (!transaction) {
      return response.status(404).json({ message: 'Transaction not found' })
    }

    return response.status(200).json(transaction)
  }

  async retry({ params, response }: HttpContext) {
    const transaction = await Transaction.find(params.id)
    if (!transaction) {
      return response.status(404).json({ message: 'Transaction not found' })
    }

    if (!['failed', 'cancelled'].includes(transaction.status)) {
      return response.status(400).json({ message: `Cannot retry transaction with status: ${transaction.status}` })
    }

    const oldStatus = transaction.status
    transaction.status = 'pending'
    transaction.errorMessage = null
    await transaction.save()

    // Create event for the retry
    await TransactionEvent.create({
      transactionId: transaction.id,
      fromStatus: oldStatus,
      toStatus: 'pending',
      payload: { action: 'retry' },
    })

    return response.status(200).json(transaction)
  }

  async cancel({ params, response }: HttpContext) {
    const transaction = await Transaction.find(params.id)
    if (!transaction) {
      return response.status(404).json({ message: 'Transaction not found' })
    }

    if (!['pending', 'processing'].includes(transaction.status)) {
      return response.status(400).json({ message: `Cannot cancel transaction with status: ${transaction.status}` })
    }

    const oldStatus = transaction.status
    transaction.status = 'cancelled'
    await transaction.save()

    await TransactionEvent.create({
      transactionId: transaction.id,
      fromStatus: oldStatus,
      toStatus: 'cancelled',
      payload: { action: 'cancel' },
    })

    return response.status(200).json(transaction)
  }

  async exportCsv({ request, response }: HttpContext) {
    const { status, txType, applicationId, providerId, currency, dateFrom, dateTo } = request.only([
      'status', 'txType', 'applicationId', 'providerId', 'currency', 'dateFrom', 'dateTo',
    ])

    const query = Transaction.query()
      .preload('application')
      .preload('provider')
      .preload('mobileOperator')

    if (status) query.where('status', status)
    if (txType) query.where('tx_type', txType)
    if (applicationId) query.where('application_id', Number(applicationId))
    if (providerId) query.where('provider_id', Number(providerId))
    if (currency) query.where('currency', currency)
    if (dateFrom) query.where('created_at', '>=', dateFrom)
    if (dateTo) query.where('created_at', '<=', dateTo)

    const transactions = await query.orderBy('created_at', 'desc')

    const header = 'ID,Reference,Type,Status,Amount,Currency,MSISDN,Provider,Application,CreatedAt\n'
    const rows = transactions.map((t) =>
      [
        t.id,
        t.reference,
        t.txType,
        t.status,
        t.amount,
        t.currency,
        t.msisdn,
        t.provider?.name || '',
        t.application?.name || '',
        t.createdAt?.toISO() || '',
      ].join(',')
    ).join('\n')

    return response
      .header('Content-Type', 'text/csv')
      .header('Content-Disposition', 'attachment; filename="transactions.csv"')
      .status(200)
      .send(header + rows)
  }
}
