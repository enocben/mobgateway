import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    // 1. Drop application_countries pivot
    this.schema.dropTableIfExists('application_countries')

    // 2. Remove organization_id from applications
    this.schema.alterTable('applications', (table) => {
      table.dropColumn('organization_id')
    })

    // 3. Users: organization_id → application_id (nullable = admin global)
    this.schema.alterTable('users', (table) => {
      table.dropColumn('organization_id')
      table.string('application_id').nullable()
        .references('id').inTable('applications').onDelete('SET NULL')
    })

    // 4. Add application_id to countries
    this.schema.alterTable('countries', (table) => {
      table.string('application_id').notNullable()
        .references('id').inTable('applications').onDelete('CASCADE')
    })

    // 5. Add application_id to currencies
    this.schema.alterTable('currencies', (table) => {
      table.string('application_id').notNullable()
        .references('id').inTable('applications').onDelete('CASCADE')
    })

    // 6. Add application_id to mobile_operators
    this.schema.alterTable('mobile_operators', (table) => {
      table.string('application_id').notNullable()
        .references('id').inTable('applications').onDelete('CASCADE')
    })

    // 7. Create application_providers (per-app provider config)
    this.schema.createTable('application_providers', (table) => {
      table.string('id').primary().defaultTo(this.raw(`'app_' || gen_random_uuid()`))
      table.string('application_id').notNullable()
        .references('id').inTable('applications').onDelete('CASCADE')
      table.string('provider_id').notNullable()
        .references('id').inTable('providers').onDelete('CASCADE')
      table.boolean('is_enabled').notNullable().defaultTo(true)
      table.jsonb('config').notNullable().defaultTo('{}')
      table.enum('environment', ['sandbox', 'production']).notNullable().defaultTo('sandbox')
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
      table.unique(['application_id', 'provider_id', 'environment'])
    })

    // 8. Drop organizations (last — nothing references it)
    this.schema.dropTableIfExists('organizations')
  }

  async down() {
    // Recreate organizations
    this.schema.createTable('organizations', (table) => {
      table.string('id').primary().defaultTo(this.raw(`'org_' || gen_random_uuid()`))
      table.string('name', 255).notNullable()
      table.enum('kyc_status', ['pending', 'approved', 'rejected']).notNullable().defaultTo('pending')
      table.enum('status', ['active', 'suspended']).notNullable().defaultTo('active')
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })

    // Drop application_providers
    this.schema.dropTableIfExists('application_providers')

    // Remove application_id from mobile_operators
    this.schema.alterTable('mobile_operators', (table) => {
      table.dropColumn('application_id')
    })

    // Remove application_id from currencies
    this.schema.alterTable('currencies', (table) => {
      table.dropColumn('application_id')
    })

    // Remove application_id from countries
    this.schema.alterTable('countries', (table) => {
      table.dropColumn('application_id')
    })

    // Users: application_id → organization_id
    this.schema.alterTable('users', (table) => {
      table.dropColumn('application_id')
      table.string('organization_id').nullable()
        .references('id').inTable('organizations').onDelete('SET NULL')
    })

    // Restore organization_id on applications
    this.schema.alterTable('applications', (table) => {
      table.string('organization_id').notNullable()
        .references('id').inTable('organizations').onDelete('CASCADE')
    })

    // Recreate application_countries
    this.schema.createTable('application_countries', (table) => {
      table.string('id').primary().defaultTo(this.raw(`'apc_' || gen_random_uuid()`))
      table.string('application_id').notNullable()
        .references('id').inTable('applications').onDelete('CASCADE')
      table.string('country_code', 2).notNullable()
        .references('code').inTable('countries').onDelete('CASCADE')
      table.boolean('is_enabled').notNullable().defaultTo(true)
      table.timestamp('created_at', { useTz: true }).notNullable()
    })
  }
}
