import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Application from './application.js'
import Country from './country.js'
import { ApplicationCountrySchema } from '#database/schema'

export default class ApplicationCountry extends ApplicationCountrySchema {
  @belongsTo(() => Application, { foreignKey: 'applicationId' })
  declare application: BelongsTo<typeof Application>

  @belongsTo(() => Country, { foreignKey: 'countryCode' })
  declare country: BelongsTo<typeof Country>
}
