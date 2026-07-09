import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Application from './application.js'
import WebhookDelivery from './webhook_delivery.js'
import { WebhookSchema } from '#database/schema'

export default class Webhook extends WebhookSchema {
  @belongsTo(() => Application, { foreignKey: 'applicationId' })
  declare application: BelongsTo<typeof Application>

  @hasMany(() => WebhookDelivery)
  declare deliveries: HasMany<typeof WebhookDelivery>
}
