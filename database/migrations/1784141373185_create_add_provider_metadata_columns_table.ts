import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'providers'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('label', 255).nullable()
      table.text('description').nullable()
      table.string('icon', 255).nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('label')
      table.dropColumn('description')
      table.dropColumn('icon')
    })
  }
}
