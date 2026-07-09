import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import MobileOperator from './mobile_operator.js'
import Provider from './provider.js'
import { ProviderRouteSchema } from '#database/schema'

export default class ProviderRoute extends ProviderRouteSchema {
  @belongsTo(() => MobileOperator, { foreignKey: 'mobileOperatorId' })
  declare mobileOperator: BelongsTo<typeof MobileOperator>

  @belongsTo(() => Provider, { foreignKey: 'providerId' })
  declare provider: BelongsTo<typeof Provider>
}
