import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'mobile_operators'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('countryId').notNullable()
        .references('id').inTable('countries').onDelete('CASCADE')
      table.dropColumn('country_code')
      table.specificType('prefix_phone', 'text[]')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('countryId')
      table.string('country_code', 2).notNullable()
        .references('code').inTable('countries').onDelete('CASCADE')
      table.dropColumn('country_code')
      table.dropColumn('prefix_phone')
    })
  }
}
