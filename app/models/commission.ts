import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Application from './application.js'
import Country from './country.js'
import Currency from './currency.js'
import MobileOperator from './mobile_operator.js'
import Provider from './provider.js'
import { CommissionSchema } from '#database/schema'

export default class Commission extends CommissionSchema {
  @belongsTo(() => Application, { foreignKey: 'applicationId' })
  declare application: BelongsTo<typeof Application>

  @belongsTo(() => Country, { foreignKey: 'countryCode' })
  declare country: BelongsTo<typeof Country>

  @belongsTo(() => Currency, { foreignKey: 'currencyCode' })
  declare currency: BelongsTo<typeof Currency>

  @belongsTo(() => MobileOperator, { foreignKey: 'mobileOperatorId' })
  declare mobileOperator: BelongsTo<typeof MobileOperator>

  @belongsTo(() => Provider, { foreignKey: 'providerId' })
  declare provider: BelongsTo<typeof Provider>
}
