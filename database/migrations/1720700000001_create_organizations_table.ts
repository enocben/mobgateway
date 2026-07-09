import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'organizations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary().defaultTo(this.raw(`'org_' || gen_random_uuid()`))
      table.string('name', 255).notNullable()
      table.enum('kyc_status', ['pending', 'approved', 'rejected']).notNullable().defaultTo('pending')
      table.enum('status', ['active', 'suspended']).notNullable().defaultTo('active')
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
