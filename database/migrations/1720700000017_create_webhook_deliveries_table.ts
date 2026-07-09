import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'webhook_deliveries'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary().defaultTo(this.raw(`'whd_' || gen_random_uuid()`))
      table.string('webhook_id').notNullable()
        .references('id').inTable('webhooks').onDelete('CASCADE')
      table.string('event', 255).notNullable()
      table.jsonb('payload').notNullable().defaultTo('{}')
      table.enum('status', ['pending', 'success', 'failed']).notNullable().defaultTo('pending')
      table.integer('attempts').notNullable().defaultTo(0)
      table.integer('response_status').nullable()
      table.text('response_body').nullable()
      table.timestamp('last_attempt_at', { useTz: true }).nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
