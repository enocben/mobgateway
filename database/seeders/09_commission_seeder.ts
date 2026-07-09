import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Commission from '#models/commission'
import Application from '#models/application'

export default class CommissionSeeder extends BaseSeeder {
  async run() {
    const app = await Application.findByOrFail('slug', 'default')

    const commissions = [
      {
        applicationId: app.id,
        countryCode: 'SN',
        currencyCode: 'XOF',
        mobileOperatorId: null,
        providerId: null,
        type: 'percentage',
        value: 2.5.toString(),
        minAmount: null,
        maxAmount: null,
      },
      {
        applicationId: null,
        countryCode: 'SN',
        currencyCode: 'XOF',
        mobileOperatorId: null,
        providerId: null,
        type: 'percentage',
        value: 1.0.toString(),
        minAmount: null,
        maxAmount: null,
      },
      {
        applicationId: null,
        countryCode: 'CM',
        currencyCode: 'XAF',
        mobileOperatorId: null,
        providerId: null,
        type: 'fixed',
        value: "100",
        minAmount: "1000",
        maxAmount: null,
      },
    ]

    for (const commission of commissions) {
      await Commission.firstOrCreate(
        {
          applicationId: commission.applicationId,
          countryCode: commission.countryCode,
          type: commission.type,
        },
        commission
      )
    }
  }
}
