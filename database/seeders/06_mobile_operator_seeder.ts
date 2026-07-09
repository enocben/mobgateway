import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Application from '#models/application'
import MobileOperator from '#models/mobile_operator'
import OperatorPrefix from '#models/operator_prefix'

export default class MobileOperatorSeeder extends BaseSeeder {
  async run() {
    const app = await Application.firstOrCreate(
      { slug: 'default' },
      { name: 'Default Application', slug: 'default', environment: 'sandbox', status: 'active' }
    )

    // RDC operators
    const orangeCD = await MobileOperator.create({ applicationId: app.id, countryCode: 'CD', name: 'Orange RDC', isEnabled: true })
    await OperatorPrefix.createMany([
      { mobileOperatorId: orangeCD.id, prefix: '081' },
      { mobileOperatorId: orangeCD.id, prefix: '082' },
      { mobileOperatorId: orangeCD.id, prefix: '084' },
    ])
    const airtelCD = await MobileOperator.create({ applicationId: app.id, countryCode: 'CD', name: 'Airtel RDC', isEnabled: true })
    await OperatorPrefix.createMany([
      { mobileOperatorId: airtelCD.id, prefix: '097' },
      { mobileOperatorId: airtelCD.id, prefix: '099' },
    ])
    const mPesaCD = await MobileOperator.create({ applicationId: app.id, countryCode: 'CD', name: 'M-Pesa RDC', isEnabled: true })
    await OperatorPrefix.createMany([{ mobileOperatorId: mPesaCD.id, prefix: '085' }])

    // Senegal operators
    const orangeSN = await MobileOperator.create({ applicationId: app.id, countryCode: 'SN', name: 'Orange Money Sénégal', isEnabled: true })
    await OperatorPrefix.createMany([{ mobileOperatorId: orangeSN.id, prefix: '077' }, { mobileOperatorId: orangeSN.id, prefix: '078' }])
    const waveSN = await MobileOperator.create({ applicationId: app.id, countryCode: 'SN', name: 'Wave Sénégal', isEnabled: true })
    await OperatorPrefix.createMany([{ mobileOperatorId: waveSN.id, prefix: '076' }])

    // CI operators
    const orangeCI = await MobileOperator.create({ applicationId: app.id, countryCode: 'CI', name: 'Orange Money CI', isEnabled: true })
    await OperatorPrefix.createMany([{ mobileOperatorId: orangeCI.id, prefix: '07' }])
    const mtnCI = await MobileOperator.create({ applicationId: app.id, countryCode: 'CI', name: 'MTN Mobile Money CI', isEnabled: true })
    await OperatorPrefix.createMany([{ mobileOperatorId: mtnCI.id, prefix: '05' }])
    const moovCI = await MobileOperator.create({ applicationId: app.id, countryCode: 'CI', name: 'Moov Money CI', isEnabled: true })
    await OperatorPrefix.createMany([{ mobileOperatorId: moovCI.id, prefix: '01' }])

    // Kenya operators
    const mPesaKE = await MobileOperator.create({ applicationId: app.id, countryCode: 'KE', name: 'M-Pesa Kenya', isEnabled: true })
    await OperatorPrefix.createMany([{ mobileOperatorId: mPesaKE.id, prefix: '07' }])
    const airtelKE = await MobileOperator.create({ applicationId: app.id, countryCode: 'KE', name: 'Airtel Money Kenya', isEnabled: true })
    await OperatorPrefix.createMany([{ mobileOperatorId: airtelKE.id, prefix: '07' }])

    // Other WAEMU countries (Orange)
    for (const code of ['ML', 'BF', 'BJ', 'TG', 'NE', 'GN']) {
      const op = await MobileOperator.create({ applicationId: app.id, countryCode: code, name: 'Orange Money', isEnabled: true })
      await OperatorPrefix.createMany([{ mobileOperatorId: op.id, prefix: '07' }])
    }

    // Ghana
    const mtnGH = await MobileOperator.create({ applicationId: app.id, countryCode: 'GH', name: 'MTN MoMo Ghana', isEnabled: true })
    await OperatorPrefix.createMany([{ mobileOperatorId: mtnGH.id, prefix: '024' }])

    // Nigeria
    const mtnNG = await MobileOperator.create({ applicationId: app.id, countryCode: 'NG', name: 'MTN MoMo Nigeria', isEnabled: true })
    await OperatorPrefix.createMany([{ mobileOperatorId: mtnNG.id, prefix: '0803' }])
    const airtelNG = await MobileOperator.create({ applicationId: app.id, countryCode: 'NG', name: 'Airtel Money Nigeria', isEnabled: true })
    await OperatorPrefix.createMany([{ mobileOperatorId: airtelNG.id, prefix: '0802' }])

    // East Africa
    for (const code of ['UG', 'TZ', 'RW', 'ZM']) {
      await MobileOperator.create({ applicationId: app.id, countryCode: code, name: 'Mobile Money', isEnabled: true })
    }
  }
}
