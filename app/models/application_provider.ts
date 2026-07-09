import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Application from '#models/application'
import Provider from '#models/provider'

export default class ApplicationProvider {
  @belongsTo(() => Application, { foreignKey: 'applicationId' })
  declare application: BelongsTo<typeof Application>

  @belongsTo(() => Provider, { foreignKey: 'providerId' })
  declare provider: BelongsTo<typeof Provider>
}
