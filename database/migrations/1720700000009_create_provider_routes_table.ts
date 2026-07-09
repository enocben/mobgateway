import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'provider_routes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary().defaultTo(this.raw(`'prr_' || gen_random_uuid()`))
      table.string('mobile_operator_id').notNullable()
        .references('id').inTable('mobile_operators').onDelete('CASCADE')
      table.string('provider_id').notNullable()
        .references('id').inTable('providers').onDelete('CASCADE')
      table.integer('priority').notNullable()
      table.boolean('is_active').notNullable().defaultTo(true)
      table.unique(['mobile_operator_id', 'priority'])
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
