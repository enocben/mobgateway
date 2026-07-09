import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Webhook from './webhook.js'
import { WebhookDeliverySchema } from '#database/schema'

export default class WebhookDelivery extends WebhookDeliverySchema {
  @belongsTo(() => Webhook, { foreignKey: 'webhookId' })
  declare webhook: BelongsTo<typeof Webhook>
}
