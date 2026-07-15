import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'provider_countries'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary().defaultTo(this.raw(`'pct_' || gen_random_uuid()`))
      table.string('provider_id').notNullable()
        .references('id').inTable('providers').onDelete('CASCADE')
      table.string('country_id').notNullable()
        .references('id').inTable('countries').onDelete('CASCADE')
      table.unique(['provider_id', 'country_id'])
      table.timestamp('created_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
