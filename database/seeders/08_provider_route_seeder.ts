import { BaseSeeder } from '@adonisjs/lucid/seeders'
import ProviderRoute from '#models/provider_route'
import MobileOperator from '#models/mobile_operator'
import Provider from '#models/provider'

export default class ProviderRouteSeeder extends BaseSeeder {
  async run() {
    const orangeProvider = await Provider.findByOrFail('code', 'orange-money')
    const mtnProvider = await Provider.findByOrFail('code', 'mtn-momo')
    const waveProvider = await Provider.findByOrFail('code', 'wave')
    const mpesaProvider = await Provider.findByOrFail('code', 'mpesa')

    // Get all mobile operators
    const operators = await MobileOperator.all()

    for (const op of operators) {
      const opName = op.name.toLowerCase()

      let providerId: string | null = null
      if (opName.includes('orange')) {
        providerId = orangeProvider.id
      } else if (opName.includes('mtn')) {
        providerId = mtnProvider.id
      } else if (opName.includes('airtel')) {
        providerId = mtnProvider.id
      } else if (opName.includes('wave')) {
        providerId = waveProvider.id
      } else if (opName.includes('m-pesa')) {
        providerId = mpesaProvider.id
      } else if (opName.includes('free')) {
        providerId = orangeProvider.id
      }

      if (providerId) {
        await ProviderRoute.firstOrCreate(
          { mobileOperatorId: op.id, priority: 1 },
          { mobileOperatorId: op.id, providerId, priority: 1, isActive: true }
        )
      }
    }
  }
}
