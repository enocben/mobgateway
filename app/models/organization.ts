import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Application from './application.js'
import User from './user.js'
import { OrganizationSchema } from '#database/schema'

export default class Organization extends OrganizationSchema {
  @hasMany(() => Application)
  declare applications: HasMany<typeof Application>

  @hasMany(() => User)
  declare users: HasMany<typeof User>
}
