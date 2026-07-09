import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Application from '#models/application'

export default class ApplicationSeeder extends BaseSeeder {
  async run() {
    const apps = [
      {
        name: 'Default Application',
        slug: 'default',
        environment: 'sandbox',
        status: 'active',
      },
      {
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
