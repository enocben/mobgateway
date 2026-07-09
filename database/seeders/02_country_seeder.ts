import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Application from '#models/application'
import Country from '#models/country'

export default class CountrySeeder extends BaseSeeder {
  async run() {
    const app = await Application.firstOrCreate(
      { slug: 'default' },
      { name: 'Default Application', slug: 'default', environment: 'sandbox', status: 'active' }
    )

    const countries = [
      { code: 'CD', name: 'RDC', currencyCode: 'CDF', phonePrefix: '+243' },
      { code: 'SN', name: 'Sénégal', currencyCode: 'XOF', phonePrefix: '+221' },
      { code: 'CI', name: "Côte d'Ivoire", currencyCode: 'XOF', phonePrefix: '+225' },
      { code: 'ML', name: 'Mali', currencyCode: 'XOF', phonePrefix: '+223' },
      { code: 'BF', name: 'Burkina Faso', currencyCode: 'XOF', phonePrefix: '+226' },
      { code: 'BJ', name: 'Bénin', currencyCode: 'XOF', phonePrefix: '+229' },
      { code: 'TG', name: 'Togo', currencyCode: 'XOF', phonePrefix: '+228' },
      { code: 'NE', name: 'Niger', currencyCode: 'XOF', phonePrefix: '+227' },
      { code: 'GN', name: 'Guinée', currencyCode: 'GNF', phonePrefix: '+224' },
      { code: 'GH', name: 'Ghana', currencyCode: 'GHS', phonePrefix: '+233' },
      { code: 'NG', name: 'Nigeria', currencyCode: 'NGN', phonePrefix: '+234' },
      { code: 'KE', name: 'Kenya', currencyCode: 'KES', phonePrefix: '+254' },
      { code: 'UG', name: 'Ouganda', currencyCode: 'UGX', phonePrefix: '+256' },
      { code: 'TZ', name: 'Tanzanie', currencyCode: 'TZS', phonePrefix: '+255' },
      { code: 'RW', name: 'Rwanda', currencyCode: 'RWF', phonePrefix: '+250' },
      { code: 'ZM', name: 'Zambie', currencyCode: 'ZMW', phonePrefix: '+260' },
      { code: 'CM', name: 'Cameroun', currencyCode: 'XAF', phonePrefix: '+237' },
    ]

    for (const country of countries) {
      await Country.firstOrCreate(
        { code: country.code, applicationId: app.id },
        { ...country, applicationId: app.id }
      )
    }
  }
}
