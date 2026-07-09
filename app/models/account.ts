import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Application from './application.js'
import { AccountSchema } from '#database/schema'

export default class Account extends AccountSchema {
  @belongsTo(() => Application)
  declare application: BelongsTo<typeof Application>
}
