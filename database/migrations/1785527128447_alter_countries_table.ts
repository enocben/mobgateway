import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'countries'

  async up() {
    // Récupère les vrais noms des FK depuis pg_constraint
    const fkResult = await this.db.rawQuery(`
      SELECT conname, conrelid::regclass::text AS table_name
      FROM pg_constraint
      WHERE confrelid = 'countries'::regclass
        AND contype = 'f'
        AND confkey @> (
          SELECT array_agg(attnum) FROM pg_attribute
          WHERE attrelid = 'countries'::regclass AND attname = 'code'
        )
    `)

    interface FkRow {
      conname: string
      table_name: string
    }

    const fkRows: FkRow[] = fkResult.rows ?? []

    // Supprime chaque FK depuis sa table propriétaire
    for (const row of fkRows) {
      await this.db.rawQuery(
        `ALTER TABLE "${row.table_name}" DROP CONSTRAINT IF EXISTS "${row.conname}"`
      )
    }

    // Supprime la contrainte unique (safe maintenant)
    this.schema.alterTable(this.tableName, (table) => {
      table.dropUnique(['code'])
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.unique('code')
    })

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
