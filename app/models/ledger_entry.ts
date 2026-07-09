import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Transaction from './transaction.js'
import Account from './account.js'
import { LedgerEntrySchema } from '#database/schema'

export default class LedgerEntry extends LedgerEntrySchema {
  @belongsTo(() => Transaction, { foreignKey: 'transactionId' })
  declare transaction: BelongsTo<typeof Transaction>

  @belongsTo(() => Account, { foreignKey: 'accountId' })
  declare account: BelongsTo<typeof Account>
}
