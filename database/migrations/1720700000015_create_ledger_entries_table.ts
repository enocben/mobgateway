import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'ledger_entries'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary().defaultTo(this.raw(`'lge_' || gen_random_uuid()`))
      table.string('transaction_id').notNullable()
        .references('id').inTable('transactions').onDelete('CASCADE')
      table.string('account_id').notNullable()
        .references('id').inTable('accounts').onDelete('CASCADE')
      table.enum('direction', ['debit', 'credit']).notNullable()
      table.decimal('amount', 15, 4).notNullable()
      table.string('currency', 3).notNullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.index('transaction_id')
      table.index('account_id')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
