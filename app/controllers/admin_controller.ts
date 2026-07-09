import type { HttpContext } from '@adonisjs/core/http'
import Application from '#models/application'
import ApplicationTransformer from '#transformers/application_transformer'

export default class AdminController {
  async index({ response }: HttpContext) {
    return response.redirect().toPath('/admin/dashboard')
  }

  async dashboard({ inertia }: HttpContext) {
    const applications = await Application.query()

    return inertia.render('admin/Monitoring/Dashboard', {
      applications: ApplicationTransformer.transform(applications),
    })
  }

  async applications({ response }: HttpContext) {
    const applications = await Application.all()
    return response.json({ applications })
  }

  async applicationsCreate({ inertia }: HttpContext) {
    return inertia.render('admin/Applications/Create', {})
  }

  async applicationsEdit({ inertia }: HttpContext) {
    return inertia.render('admin/Applications/Edit', {})
  }

  async applicationsDetail({ inertia }: HttpContext) {
    return inertia.render('admin/Applications/Detail', {})
  }

  async users({ inertia }: HttpContext) {
    return inertia.render('admin/Users/List', {})
  }

  async usersDetail({ inertia }: HttpContext) {
    return inertia.render('admin/Users/Detail', {})
  }

  async providers({ inertia }: HttpContext) {
    return inertia.render('admin/Providers/List', {})
  }

  async providersCreate({ inertia }: HttpContext) {
    return inertia.render('admin/Providers/Create', {})
  }

  async providersDetail({ inertia }: HttpContext) {
    return inertia.render('admin/Providers/Detail', {})
  }

  async mobileOperators({ inertia }: HttpContext) {
    return inertia.render('admin/MobileOperators/List', {})
  }

  async countries({ inertia }: HttpContext) {
    return inertia.render('admin/Countries/List', {})
  }

  async currencies({ inertia }: HttpContext) {
    return inertia.render('admin/Currencies/List', {})
  }

  async transactions({ inertia }: HttpContext) {
    return inertia.render('admin/Transactions/List', {})
  }

  async webhooks({ inertia }: HttpContext) {
    return inertia.render('admin/Webhooks/List', {})
  }

  async commissions({ inertia }: HttpContext) {
    return inertia.render('admin/Commissions/List', {})
  }

  async routing({ inertia }: HttpContext) {
    return inertia.render('admin/Routing/Config', {})
  }

  async logs({ inertia }: HttpContext) {
    return inertia.render('admin/Logs/List', {})
  }

  async monitoring({ inertia }: HttpContext) {
    return inertia.render('admin/Monitoring/Dashboard', {})
  }

  async settings({ inertia }: HttpContext) {
    return inertia.render('admin/Settings/General', {})
  }
}
