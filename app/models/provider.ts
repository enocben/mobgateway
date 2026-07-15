import { hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Country from './country.js'
import ProviderRoute from './provider_route.js'
import Transaction from './transaction.js'
import { ProviderSchema } from '#database/schema'

export default class Provider extends ProviderSchema {
  @hasMany(() => ProviderRoute)
  declare routes: HasMany<typeof ProviderRoute>

  @hasMany(() => Transaction)
  declare transactions: HasMany<typeof Transaction>

  @manyToMany(() => Country, {
    pivotTable: 'provider_countries',
    pivotForeignKey: 'provider_id',
    pivotRelatedForeignKey: 'country_id',
  })
  declare countries: ManyToMany<typeof Country>
}
