import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'providers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary().defaultTo(this.raw(`'prv_' || gen_random_uuid()`))
      table.string('name', 255).notNullable()
      table.string('code', 100).notNullable()
      table.enum('type', ['direct', 'aggregator']).notNullable()
      table.enum('status', ['active', 'inactive']).notNullable().defaultTo('active')
      table.jsonb('config').notNullable().defaultTo('{}')
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
