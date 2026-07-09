import Account from '#models/account'
import LedgerEntry from '#models/ledger_entry'
import Transaction from '#models/transaction'
import db from '@adonisjs/lucid/services/db'

export default class LedgerService {
  /**
   * Ensure accounts exist for a given application/currency combination
   */
  async ensureAccounts(applicationId: number, currency: string) {
    const accountTypes: Array<'app_balance' | 'operator_suspense' | 'platform_revenue'> = [
      'app_balance',
      'operator_suspense',
      'platform_revenue',
    ]

    const accounts: Record<string, Account> = {}

    for (const accountType of accountTypes) {
      let account = await Account.query()
        .where('application_id', applicationId)
        .where('account_type', accountType)
        .where('currency', currency)
        .first()

      if (!account) {
        account = await Account.create({
          applicationId,
          accountType,
          currency,
          balanceCached: 0,
        })
      }

      accounts[accountType] = account
    }

    return accounts
  }

  /**
   * Record double-entry ledger entries for a transaction
   *
   * For a collection (deposit):
   *   DEBIT  operator_suspense  (money owed by operator)
   *   CREDIT app_balance         (money due to application)
   *
   * For a payout:
   *   DEBIT  app_balance         (money leaving application)
   *   CREDIT operator_suspense   (money sent to operator)
   *
   * Platform revenue is booked separately as a commission deduction.
   */
  async recordTransaction(
    transaction: Transaction,
    commissionAmount: number = 0
  ): Promise<LedgerEntry[]> {
    const accounts = await this.ensureAccounts(transaction.applicationId, transaction.currency)

    const entries: LedgerEntry[] = []

    await db.transaction(async (trx) => {
      if (transaction.txType === 'collection') {
        // Collection: DEBIT operator_suspense, CREDIT app_balance
        const debit = await LedgerEntry.create({
          transactionId: transaction.id,
          accountId: accounts.operator_suspense.id,
          direction: 'debit',
          amount: transaction.amount,
          currency: transaction.currency,
        }, { client: trx })
        entries.push(debit)

        const netAmount = transaction.amount - commissionAmount

        const credit = await LedgerEntry.create({
          transactionId: transaction.id,
          accountId: accounts.app_balance.id,
          direction: 'credit',
          amount: netAmount,
          currency: transaction.currency,
        }, { client: trx })
        entries.push(credit)

        // Book commission if any
        if (commissionAmount > 0) {
          const commissionEntry = await LedgerEntry.create({
            transactionId: transaction.id,
            accountId: accounts.platform_revenue.id,
            direction: 'credit',
            amount: commissionAmount,
            currency: transaction.currency,
          }, { client: trx })
          entries.push(commissionEntry)
        }

        // Update cached balances
        await Account.query({ client: trx })
          .where('id', accounts.operator_suspense.id)
          .increment('balance_cached', transaction.amount)

        await Account.query({ client: trx })
          .where('id', accounts.app_balance.id)
          .increment('balance_cached', netAmount)

        if (commissionAmount > 0) {
          await Account.query({ client: trx })
            .where('id', accounts.platform_revenue.id)
            .increment('balance_cached', commissionAmount)
        }
      } else {
        // Payout: DEBIT app_balance, CREDIT operator_suspense
        const debit = await LedgerEntry.create({
          transactionId: transaction.id,
          accountId: accounts.app_balance.id,
          direction: 'debit',
          amount: transaction.amount,
          currency: transaction.currency,
        }, { client: trx })
        entries.push(debit)

        const credit = await LedgerEntry.create({
          transactionId: transaction.id,
          accountId: accounts.operator_suspense.id,
          direction: 'credit',
          amount: transaction.amount,
          currency: transaction.currency,
        }, { client: trx })
        entries.push(credit)

        // Book commission if any
        if (commissionAmount > 0) {
          const commissionEntry = await LedgerEntry.create({
            transactionId: transaction.id,
            accountId: accounts.platform_revenue.id,
            direction: 'credit',
            amount: commissionAmount,
            currency: transaction.currency,
          }, { client: trx })
          entries.push(commissionEntry)
        }

        // Update cached balances
        await Account.query({ client: trx })
          .where('id', accounts.app_balance.id)
          .decrement('balance_cached', transaction.amount)

        await Account.query({ client: trx })
          .where('id', accounts.operator_suspense.id)
          .increment('balance_cached', transaction.amount)

        if (commissionAmount > 0) {
          await Account.query({ client: trx })
            .where('id', accounts.platform_revenue.id)
            .increment('balance_cached', commissionAmount)
        }
      }
    })

    return entries
  }

  /**
   * Get balance for an account
   */
  async getBalance(applicationId: number, accountType: string, currency: string): Promise<number> {
    const account = await Account.query()
      .where('application_id', applicationId)
      .where('account_type', accountType)
      .where('currency', currency)
      .first()

    return account?.balanceCached ?? 0
  }
}
