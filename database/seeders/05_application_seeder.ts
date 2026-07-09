import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Application from '#models/application'
import Organization from '#models/organization'

export default class ApplicationSeeder extends BaseSeeder {
  async run() {
    const org = await Organization.findByOrFail('name', 'Default Organization')

    const apps = [
      {
        organizationId: org.id,
        name: 'Default Application',
        slug: 'default',
        environment: 'sandbox',
        status: 'active',
      },
      {
        organizationId: org.id,
        name: 'Dev Test App',
        slug: 'dev-test',
        environment: 'sandbox',
        status: 'active',
      },
    ]

    for (const app of apps) {
      await Application.firstOrCreate({ slug: app.slug }, app)
    }
  }
}
