import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'commissions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary().defaultTo(this.raw(`'cms_' || gen_random_uuid()`))
      table.string('application_id').nullable()
        .references('id').inTable('applications').onDelete('CASCADE')
      table.string('country_code', 2).nullable()
        .references('code').inTable('countries').onDelete('SET NULL')
      table.string('currency_code', 3).nullable()
        .references('code').inTable('currencies').onDelete('SET NULL')
      table.string('mobile_operator_id').nullable()
        .references('id').inTable('mobile_operators').onDelete('SET NULL')
      table.string('provider_id').nullable()
        .references('id').inTable('providers').onDelete('SET NULL')
      table.enum('type', ['fixed', 'percentage']).notNullable()
      table.decimal('value', 15, 4).notNullable()
      table.decimal('min_amount', 15, 4).nullable()
      table.decimal('max_amount', 15, 4).nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
