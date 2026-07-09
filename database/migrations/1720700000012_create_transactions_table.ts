import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary().defaultTo(this.raw(`'txn_' || gen_random_uuid()`))
      table.string('application_id').notNullable()
        .references('id').inTable('applications').onDelete('CASCADE')
      table.string('mobile_operator_id').nullable()
        .references('id').inTable('mobile_operators').onDelete('SET NULL')
      table.string('provider_id').nullable()
        .references('id').inTable('providers').onDelete('SET NULL')
      table.string('provider_route_id').nullable()
        .references('id').inTable('provider_routes').onDelete('SET NULL')
      table.string('idempotency_key', 255).notNullable().unique()
      table.enum('tx_type', ['collection', 'payout']).notNullable()
      table.string('msisdn', 30).notNullable()
      table.string('provider_ref', 255).nullable()
      table.string('reference', 100).notNullable().unique()
      table.decimal('amount', 15, 4).notNullable()
      table.string('currency', 3).notNullable()
      table.decimal('fx_rate', 10, 6).notNullable().defaultTo(1.0)
      table.enum('status', ['expected', 'pending', 'processing', 'completed', 'failed', 'cancelled'])
        .notNullable().defaultTo('pending')
      table.jsonb('metadata').notNullable().defaultTo('{}')
      table.text('error_message').nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
