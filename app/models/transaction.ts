import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Application from './application.js'
import MobileOperator from './mobile_operator.js'
import Provider from './provider.js'
import ProviderRoute from './provider_route.js'
import TransactionEvent from './transaction_event.js'
import { TransactionSchema } from '#database/schema'

export default class Transaction extends TransactionSchema {
  @belongsTo(() => Application, { foreignKey: 'applicationId' })
  declare application: BelongsTo<typeof Application>

  @belongsTo(() => MobileOperator, { foreignKey: 'mobileOperatorId' })
  declare mobileOperator: BelongsTo<typeof MobileOperator>

  @belongsTo(() => Provider, { foreignKey: 'providerId' })
  declare provider: BelongsTo<typeof Provider>

  @belongsTo(() => ProviderRoute, { foreignKey: 'providerRouteId' })
  declare providerRoute: BelongsTo<typeof ProviderRoute>

  @hasMany(() => TransactionEvent)
  declare events: HasMany<typeof TransactionEvent>
}
