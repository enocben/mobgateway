import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Organization from '#models/organization'
import User from '#models/user'

export default class UserSeeder extends BaseSeeder {
  async run() {
    const org = await Organization.firstOrCreate(
      { name: 'Default Organization' },
      {
        name: 'Default Organization',
        kycStatus: 'approved',
        status: 'active',
      }
    )

    const users = [
      {
        organizationId: org.id,
        name: 'Super Admin',
        email: 'admin@mmg.local',
        password: 'admin123',
        role: 'super_admin',
        status: 'active',
      },
      {
        organizationId: org.id,
        name: 'Support Agent',
        email: 'support@mmg.local',
        password: 'support123',
        role: 'support',
        status: 'active',
      },
      {
        organizationId: org.id,
        name: 'Developer',
        email: 'dev@mmg.local',
        password: 'dev123',
        role: 'developer',
        status: 'active',
      },
    ]

    for (const user of users) {
      await User.firstOrCreate({ email: user.email }, user)
    }
  }
}
