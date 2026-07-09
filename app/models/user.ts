import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import hash from '@adonisjs/core/services/hash'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Organization from './organization.js'
import Application from './application.js'
import AuditLog from './audit_log.js'
import { UserSchema } from '#database/schema'

export default class User extends compose(UserSchema, withAuthFinder(() => hash.use('scrypt'))) {
  @belongsTo(() => Organization, { foreignKey: 'organizationId' })
  declare organization: BelongsTo<typeof Organization>

  @hasMany(() => Application)
  declare applications: HasMany<typeof Application>

  @hasMany(() => AuditLog)
  declare auditLogs: HasMany<typeof AuditLog>

  static accessTokens = DbAccessTokensProvider.forModel(User)

  get initials() {
    const [first, last] = this.name ? this.name.split(' ') : this.email.split('@')
    if (first && last) {
      return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
    }
    return `${first.slice(0, 2)}`.toUpperCase()
  }
}
