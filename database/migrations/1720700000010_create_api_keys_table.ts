import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'api_keys'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary().defaultTo(this.raw(`'apk_' || gen_random_uuid()`))
      table.string('application_id').notNullable()
        .references('id').inTable('applications').onDelete('CASCADE')
      table.enum('key_type', ['public', 'secret']).notNullable()
      table.string('key_hash', 255).notNullable()
      table.string('name', 255).notNullable()
      table.jsonb('permissions').notNullable().defaultTo('{}')
      table.timestamp('expires_at', { useTz: true }).nullable()
      table.timestamp('last_used_at', { useTz: true }).nullable()
      table.timestamp('revoked_at', { useTz: true }).nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
