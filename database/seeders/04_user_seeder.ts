import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Application from '#models/application'
import User from '#models/user'

export default class UserSeeder extends BaseSeeder {
  async run() {
    const app = await Application.firstOrCreate(
      { slug: 'default' },
      {
        name: 'Default Application',
        slug: 'default',
        environment: 'sandbox',
        status: 'active',
      }
    )

    const users = [
      {
        applicationId: app.id,
        name: 'Super Admin',
        email: 'admin@mmg.local',
        password: 'admin123',
        role: 'super_admin',
        status: 'active',
      },
      {
        applicationId: null, // admin global — peut voir toutes les apps
        name: 'Global Admin',
        email: 'global@mmg.local',
        password: 'admin123',
        role: 'admin',
        status: 'active',
      },
      {
        applicationId: app.id,
        name: 'Support Agent',
        email: 'support@mmg.local',
        password: 'support123',
        role: 'support',
        status: 'active',
      },
      {
        applicationId: app.id,
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
