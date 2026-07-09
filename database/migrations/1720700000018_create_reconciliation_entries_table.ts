import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'reconciliation_entries'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary().defaultTo(this.raw(`'rce_' || gen_random_uuid()`))
      table.string('transaction_id').nullable()
        .references('id').inTable('transactions').onDelete('SET NULL')
      table.enum('source', ['operator_csv', 'operator_api']).notNullable()
      table.string('external_ref', 255).notNullable()
      table.decimal('amount', 15, 4).notNullable()
      table.string('currency', 3).notNullable()
      table.enum('status', ['pending', 'matched', 'exception']).notNullable().defaultTo('pending')
      table.timestamp('matched_at', { useTz: true }).nullable()
      table.jsonb('metadata').notNullable().defaultTo('{}')
      table.timestamp('created_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
