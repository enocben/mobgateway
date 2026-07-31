import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'countries'

  async up() {
    // CASCADE car des clés étrangères dépendent de cette contrainte unique
    await this.db.rawQuery(
      'ALTER TABLE "countries" DROP CONSTRAINT IF EXISTS "countries_code_unique" CASCADE'
    )
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.unique('code')
    })
  }
}
