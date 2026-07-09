import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transaction_events'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary().defaultTo(this.raw(`'txe_' || gen_random_uuid()`))
      table.string('transaction_id').notNullable()
        .references('id').inTable('transactions').onDelete('CASCADE')
      table.string('from_status', 50).nullable()
      table.string('to_status', 50).notNullable()
      table.jsonb('payload').notNullable().defaultTo('{}')
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.index('transaction_id')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
