import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Application from './application.js'
import { CurrencySchema } from '#database/schema'

export default class Currency extends CurrencySchema {
  @belongsTo(() => Application, { foreignKey: 'applicationId' })
  declare application: BelongsTo<typeof Application>
}
