import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary().defaultTo(this.raw(`'usr_' || gen_random_uuid()`))
      table.string('organization_id').nullable()
        .references('id').inTable('organizations').onDelete('SET NULL')
      table.string('name', 255).notNullable()
      table.string('email', 255).notNullable().unique()
      table.string('password', 255).notNullable()
      table.enum('role', ['super_admin', 'admin', 'support', 'finance', 'developer', 'readonly'])
        .notNullable().defaultTo('readonly')
      table.enum('status', ['active', 'suspended']).notNullable().defaultTo('active')
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
