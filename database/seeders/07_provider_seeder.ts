import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Provider from '#models/provider'

export default class ProviderSeeder extends BaseSeeder {
  async run() {
    await Provider.createMany([
      { name: 'Paystack', code: 'paystack', type: 'aggregator', status: 'active', config: {} },
      { name: 'Flutterwave', code: 'flutterwave', type: 'aggregator', status: 'active', config: {} },
      { name: 'M-Pesa API', code: 'mpesa', type: 'direct', status: 'active', config: {} },
      { name: 'Orange Money API', code: 'orange-money', type: 'direct', status: 'active', config: {} },
      { name: 'Wave API', code: 'wave', type: 'direct', status: 'active', config: {} },
      { name: 'MTN MoMo API', code: 'mtn-momo', type: 'direct', status: 'active', config: {} },
      { name: 'Custom HTTP Provider', code: 'http', type: 'aggregator', status: 'active', config: {} },
    ])
  }
}
