import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'operator_prefixes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary().defaultTo(this.raw(`'opp_' || gen_random_uuid()`))
      table.string('mobile_operator_id').notNullable()
        .references('id').inTable('mobile_operators').onDelete('CASCADE')
      table.string('prefix', 10).notNullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
