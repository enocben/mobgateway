import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'countries'

  async up() {
    // 1. Supprimer d'abord les FK qui dépendent de l'unicité du `code`
    this.schema.alterTable('commissions', (table) => {
      table.dropForeign('country_code')
    })

    this.schema.alterTable('mobile_operators', (table) => {
      table.dropForeign('country_code')
    })

    this.schema.alterTable('application_countries', (table) => {
      table.dropForeign('country_code')
    })

    // 2. Supprimer la contrainte unique maintenant qu'elle n'a plus de dépendances
    this.schema.alterTable(this.tableName, (table) => {
      table.dropUnique('code')
    })
  }

  async down() {
    // Restaurer la contrainte unique
    this.schema.alterTable(this.tableName, (table) => {
      table.unique('code')
    })

    // Restaurer les FK
    this.schema.alterTable('commissions', (table) => {
      table.foreign('country_code').references('code').inTable('countries').onDelete('SET NULL')
    })

    this.schema.alterTable('mobile_operators', (table) => {
      table.foreign('country_code').references('code').inTable('countries').onDelete('CASCADE')
    })

    this.schema.alterTable('application_countries', (table) => {
      table.foreign('country_code').references('code').inTable('countries').onDelete('CASCADE')
    })
  }
}
