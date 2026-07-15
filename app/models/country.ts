import { belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Application from './application.js'
import Provider from './provider.js'
import { CountrySchema } from '#database/schema'

export default class Country extends CountrySchema {
  @belongsTo(() => Application, { foreignKey: 'applicationId' })
  declare application: BelongsTo<typeof Application>

  @manyToMany(() => Provider, {
    pivotTable: 'provider_countries',
    pivotForeignKey: 'country_id',
    pivotRelatedForeignKey: 'provider_id',
  })
  declare providers: ManyToMany<typeof Provider>
}
