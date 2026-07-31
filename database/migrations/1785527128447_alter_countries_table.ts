import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'countries'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropUnique('code')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.unique('code')
    })
  }
}
