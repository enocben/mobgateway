import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Application from './application.js'
import Country from './country.js'
import OperatorPrefix from './operator_prefix.js'
import { MobileOperatorSchema } from '#database/schema'

export default class MobileOperator extends MobileOperatorSchema {
  @belongsTo(() => Application, { foreignKey: 'applicationId' })
  declare application: BelongsTo<typeof Application>

  @belongsTo(() => Country, { foreignKey: 'countryCode' })
  declare country: BelongsTo<typeof Country>

  @hasMany(() => OperatorPrefix)
  declare prefixes: HasMany<typeof OperatorPrefix>
}
