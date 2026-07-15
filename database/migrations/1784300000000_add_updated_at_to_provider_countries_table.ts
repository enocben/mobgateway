import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'provider_countries'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.timestamp('updated_at', { useTz: true }).nullable()
      table.timestamp('created_at', { useTz: true }).alter()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('updated_at')
    })
  }
}
