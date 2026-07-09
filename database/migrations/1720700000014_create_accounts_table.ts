import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'accounts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary().defaultTo(this.raw(`'acc_' || gen_random_uuid()`))
      table.string('application_id').notNullable()
        .references('id').inTable('applications').onDelete('CASCADE')
      table.enum('account_type', ['app_balance', 'operator_suspense', 'platform_revenue']).notNullable()
      table.string('currency', 3).notNullable()
      table.decimal('balance_cached', 15, 4).notNullable().defaultTo(0)
      table.unique(['application_id', 'account_type', 'currency'])
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
