import type { HttpContext } from '@adonisjs/core/http'
import Application from '#models/application'
import ApplicationTransformer from '#transformers/application_transformer'
import User from '#models/user'
import UserTransformer from '#transformers/user_transformer'
import db from '@adonisjs/lucid/services/db'

export default class AdminController {
  async index({ response }: HttpContext) {
    return response.redirect().toPath('/admin/dashboard')
  }

  async dashboard({ inertia, auth }: HttpContext) {
    const user = auth.user!
    const applications = user.role === 'admin' || user.role === 'super_admin'
      ? await Application.query().orderBy('createdAt', 'asc')
      : await Application.query().whereHas('users', (q) => q.where('id', user.id)).orderBy('createdAt', 'asc')

    const appIds = applications.map((a) => a.id)
    const [txStats, userCount, providerCount] = await Promise.all([
      db.from('transactions').whereIn('application_id', appIds)
        .select(
          db.raw('COUNT(*)::int as total'),
          db.raw("COALESCE(SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END), 0) as volume"),
          db.raw("COALESCE(SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END), 0) as completed")
        ).first(),
      db.from('users').whereIn('application_id', appIds).count('* as count').first(),
      db.from('providers').where('status', 'active').count('* as count').first(),
    ])

    const totalTx = Number(txStats?.total ?? 0)
    const volume = Number(txStats?.volume ?? 0)
    const completed = Number(txStats?.completed ?? 0)
    const successRate = totalTx > 0 ? Number(((completed / totalTx) * 100).toFixed(1)) : 0

    return inertia.render('admin/Monitoring/Dashboard', {
      applications: ApplicationTransformer.transform(applications),
      stats: {
        totalApplications: applications.length,
        totalUsers: Number(userCount?.count ?? 0),
        totalTransactions: totalTx,
        totalRevenue: volume,
        successRate,
        activeProviders: Number(providerCount?.count ?? 0),
      },
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

  async users({ inertia, params, auth }: HttpContext) {
    const user = auth.user!
    const isAdmin = user.role === 'admin' || user.role === 'super_admin'
    const query = User.query().preload('application')

    if (!isAdmin) {
      query.where('applicationId', params.id)
    }

    const users = await query.orderBy('createdAt', 'desc')
    return inertia.render('admin/Users/List', {
      users: UserTransformer.transform(users),
    })
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
