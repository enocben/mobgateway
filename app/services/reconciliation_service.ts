import ReconciliationEntry from '#models/reconciliation_entry'
import Transaction from '#models/transaction'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export default class ReconciliationService {
  /**
   * Process operator statement (CSV or API)
   */
  async processStatement(file: any): Promise<{ imported: number; errors: string[] }> {
    const errors: string[] = []
    let imported = 0

    // In production, parse the CSV file
    // For now, this is a stub implementation
    const content = await file.tmpPath
    if (!content) {
      errors.push('File is empty')
      return { imported, errors }
    }

    return { imported, errors }
  }

  /**
   * Run automatic reconciliation between pending entries and transactions
   */
  async runAutoReconciliation(dateFrom?: string, dateTo?: string): Promise<{
    matched: number
    exceptions: number
    pending: number
  }> {
    // Find pending reconciliation entries
    const query = ReconciliationEntry.query().where('status', 'pending')

    if (dateFrom) query.where('created_at', '>=', dateFrom)
    if (dateTo) query.where('created_at', '<=', dateTo)

    const entries = await query

    let matched = 0
    let exceptions = 0
    let pending = 0

    for (const entry of entries) {
      // Try to match by amount + currency within a time window
      const transaction = await Transaction.query()
        .where('amount', entry.amount)
        .where('currency', entry.currency)
        .where('status', 'completed')
        .where('created_at', '>=', entry.createdAt.minus({ days: 3 }).toSQL()!)
        .where('created_at', '<=', entry.createdAt.plus({ days: 1 }).toSQL()!)
        .first()

      if (transaction) {
        entry.transactionId = transaction.id
        entry.status = 'matched'
        entry.matchedAt = DateTime.now()
        await entry.save()
        matched++
      } else {
        // Check if there's a close match
        const closeMatch = await Transaction.query()
          .where('status', 'completed')
          .where('currency', entry.currency)
          .where('created_at', '>=', entry.createdAt.minus({ days: 1 }).toSQL()!)
          .where('created_at', '<=', entry.createdAt.plus({ days: 1 }).toSQL()!)
          .whereBetween('amount', [entry.amount * 0.95, entry.amount * 1.05])
          .first()

        if (closeMatch) {
          entry.transactionId = closeMatch.id
          entry.status = 'exception'
          entry.metadata = { ...entry.metadata, reason: 'amount mismatch', expectedAmount: entry.amount, actualAmount: closeMatch.amount }
          await entry.save()
          exceptions++
        } else {
          pending++
        }
      }
    }

    return { matched, exceptions, pending }
  }

  /**
   * Manually match a reconciliation entry with a transaction
   */
  async manualMatch(reconciliationEntryId: number, transactionId: number): Promise<ReconciliationEntry> {
    const entry = await ReconciliationEntry.findOrFail(reconciliationEntryId)
    const transaction = await Transaction.findOrFail(transactionId)

    entry.transactionId = transaction.id
    entry.status = 'matched'
    entry.matchedAt = DateTime.now()
    entry.metadata = {
      ...entry.metadata,
      matchedBy: 'manual',
      transactionAmount: transaction.amount,
      transactionCurrency: transaction.currency,
    }
    await entry.save()

    return entry
  }
}
