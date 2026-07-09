import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'audit_logs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary().defaultTo(this.raw(`'aud_' || gen_random_uuid()`))
      table.string('user_id').nullable()
        .references('id').inTable('users').onDelete('SET NULL')
      table.string('application_id').nullable()
        .references('id').inTable('applications').onDelete('SET NULL')
      table.string('action', 255).notNullable()
      table.string('entity_type', 255).notNullable()
      table.string('entity_id').notNullable()
      table.jsonb('old_value').nullable()
      table.jsonb('new_value').nullable()
      table.string('ip_address', 45).notNullable()
      table.string('user_agent', 512).nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
