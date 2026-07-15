import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Provider from './provider.js'
import Country from './country.js'
import { ProviderCountrySchema } from '#database/schema'

export default class ProviderCountry extends ProviderCountrySchema {
  @belongsTo(() => Provider, { foreignKey: 'providerId' })
  declare provider: BelongsTo<typeof Provider>

  @belongsTo(() => Country, { foreignKey: 'countryId' })
  declare country: BelongsTo<typeof Country>
}
