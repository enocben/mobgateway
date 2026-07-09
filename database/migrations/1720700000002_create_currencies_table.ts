import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'currencies'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary().defaultTo(this.raw(`'curr' || gen_random_uuid()`))
      table.string('code', 3).unique()
      table.string('name', 255).notNullable()
      table.string('symbol', 10).notNullable()
      table.integer('decimals').notNullable().defaultTo(2)
      table.boolean('is_active').notNullable().defaultTo(true)
      table.timestamp('created_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
