import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import ProviderRoute from './provider_route.js'
import Transaction from './transaction.js'
import { ProviderSchema } from '#database/schema'

export default class Provider extends ProviderSchema {
  @hasMany(() => ProviderRoute)
  declare routes: HasMany<typeof ProviderRoute>

  @hasMany(() => Transaction)
  declare transactions: HasMany<typeof Transaction>
}
