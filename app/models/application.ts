import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Organization from './organization.js'
import Transaction from './transaction.js'
import ApiKey from './api_key.js'
import Commission from './commission.js'
import AuditLog from './audit_log.js'
import { ApplicationSchema } from '#database/schema'

export default class Application extends ApplicationSchema {
  @belongsTo(() => Organization, { foreignKey: 'organizationId' })
  declare organization: BelongsTo<typeof Organization>

  @hasMany(() => Transaction)
  declare transactions: HasMany<typeof Transaction>

  @hasMany(() => ApiKey)
  declare apiKeys: HasMany<typeof ApiKey>

  @hasMany(() => Commission)
  declare commissions: HasMany<typeof Commission>

  @hasMany(() => AuditLog)
  declare auditLogs: HasMany<typeof AuditLog>
}
