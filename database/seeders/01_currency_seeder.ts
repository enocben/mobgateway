import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Currency from '#models/currency'

export default class CurrencySeeder extends BaseSeeder {
  async run() {
    const currencies = [
      { code: 'CDF', name: 'Franc Congolais', symbol: 'FC', decimals: 2, isActive: true },
      { code: 'XAF', name: 'Franc CFA (BEAC)', symbol: 'FCFA', decimals: 0, isActive: true },
      { code: 'XOF', name: 'Franc CFA (BCEAO)', symbol: 'CFA', decimals: 0, isActive: true },
      { code: 'EUR', name: 'Euro', symbol: '€', decimals: 2, isActive: true },
      { code: 'USD', name: 'US Dollar', symbol: '$', decimals: 2, isActive: true },
      { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵', decimals: 2, isActive: true },
      { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', decimals: 2, isActive: true },
      { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', decimals: 2, isActive: true },
      { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh', decimals: 0, isActive: true },
      { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh', decimals: 2, isActive: true },
      { code: 'RWF', name: 'Rwandan Franc', symbol: 'RF', decimals: 0, isActive: true },
      { code: 'ZMW', name: 'Zambian Kwacha', symbol: 'ZK', decimals: 2, isActive: true },
      { code: 'GNF', name: 'Guinean Franc', symbol: 'FG', decimals: 0, isActive: true },
    ]

    for (const currency of currencies) {
      await Currency.firstOrCreate({ code: currency.code }, currency)
    }
  }
}
