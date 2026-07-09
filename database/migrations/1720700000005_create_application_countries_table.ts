import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'application_countries'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary().defaultTo(this.raw(`'apc_' || gen_random_uuid()`))
      table.string('application_id').notNullable()
        .references('id').inTable('applications').onDelete('CASCADE')
      table.string('country_code', 2).notNullable()
        .references('code').inTable('countries').onDelete('CASCADE')
      table.boolean('is_enabled').notNullable().defaultTo(true)
      table.timestamp('created_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
