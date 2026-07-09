import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'mobile_operators'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary().defaultTo(this.raw(`'mop_' || gen_random_uuid()`))
      table.string('country_code', 2).notNullable()
        .references('code').inTable('countries').onDelete('CASCADE')
      table.string('name', 255).notNullable()
      table.string('logo_url', 255).nullable()
      table.boolean('is_enabled').notNullable().defaultTo(true)
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
