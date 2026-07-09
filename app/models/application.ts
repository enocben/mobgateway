import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Transaction from './transaction.js'
import ApiKey from './api_key.js'
import Commission from './commission.js'
import AuditLog from './audit_log.js'
import User from './user.js'
import Country from './country.js'
import Currency from './currency.js'
import MobileOperator from './mobile_operator.js'
import ApplicationProvider from './application_provider.js'
import { ApplicationSchema } from '#database/schema'

export default class Application extends ApplicationSchema {
  @hasMany(() => Transaction)
  declare transactions: HasMany<typeof Transaction>

  @hasMany(() => ApiKey)
  declare apiKeys: HasMany<typeof ApiKey>

  @hasMany(() => Commission)
  declare commissions: HasMany<typeof Commission>

  @hasMany(() => AuditLog)
  declare auditLogs: HasMany<typeof AuditLog>

  @hasMany(() => User)
  declare users: HasMany<typeof User>

  @hasMany(() => Country)
  declare countries: HasMany<typeof Country>

  @hasMany(() => Currency)
  declare currencies: HasMany<typeof Currency>

  @hasMany(() => MobileOperator)
  declare mobileOperators: HasMany<typeof MobileOperator>

  @hasMany(() => ApplicationProvider)
  declare applicationProviders: HasMany<typeof ApplicationProvider>
}
