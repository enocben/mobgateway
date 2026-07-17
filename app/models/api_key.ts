import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Application from './application.js'
import { ApiKeySchema } from '#database/schema'
import { randomUUID } from 'node:crypto'

export default class ApiKey extends ApiKeySchema {
  @belongsTo(() => Application, { foreignKey: 'applicationId' })
  declare application: BelongsTo<typeof Application>

  static generateKey(){
    return `sec_${randomUUID().replace(/-/g, '')}`
  }
}
