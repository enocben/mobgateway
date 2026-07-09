import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Organization from '#models/organization'

export default class OrganizationSeeder extends BaseSeeder {
  async run() {
    await Organization.create({
      name: 'Default Organization',
      kycStatus: 'approved',
      status: 'active',
    })
  }
}
