import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'applications'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary().defaultTo(this.raw(`'app_' || gen_random_uuid()`))
      table.string('organization_id').notNullable()
        .references('id').inTable('organizations').onDelete('CASCADE')
      table.string('name', 255).notNullable()
      table.string('slug', 255).notNullable().unique()
      table.enum('environment', ['sandbox', 'production']).notNullable().defaultTo('sandbox')
      table.enum('status', ['active', 'suspended']).notNullable().defaultTo('active')
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
