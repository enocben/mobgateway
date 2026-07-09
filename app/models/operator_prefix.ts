import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import MobileOperator from './mobile_operator.js'
import { OperatorPrefixSchema } from '#database/schema'

export default class OperatorPrefix extends OperatorPrefixSchema {
  @belongsTo(() => MobileOperator, { foreignKey: 'mobileOperatorId' })
  declare mobileOperator: BelongsTo<typeof MobileOperator>
}
