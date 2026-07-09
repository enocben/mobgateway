import type { HttpContext } from '@adonisjs/core/http'

export default class AdminController {
  async index({ response }: HttpContext) {
    return response.redirect().toPath('/admin/dashboard')
  }

  async dashboard({ inertia }: HttpContext) {
    return inertia.render('admin/Monitoring/Dashboard', {
      stats: {
        totalApplications: 12,
        totalUsers: 48,
        totalTransactions: 12543,
        totalRevenue: 4528000,
        successRate: 98.5,
        activeProviders: 6,
        recentTransactions: [
          { id: '1', amount: 5000, currency: 'XOF', status: 'completed', type: 'collection', provider: 'Orange Money', operator: 'Orange', msisdn: '+225****0707', reference: 'REF-001', createdAt: new Date().toISOString() },
          { id: '2', amount: 15000, currency: 'XOF', status: 'pending', type: 'payout', provider: 'MTN Money', operator: 'MTN', msisdn: '+225****0505', reference: 'REF-002', createdAt: new Date(Date.now() - 3600000).toISOString() },
          { id: '3', amount: 2500, currency: 'XOF', status: 'completed', type: 'collection', provider: 'Wave', operator: 'Wave', msisdn: '+225****0101', reference: 'REF-003', createdAt: new Date(Date.now() - 7200000).toISOString() },
          { id: '4', amount: 50000, currency: 'XOF', status: 'failed', type: 'payout', provider: 'Moov Money', operator: 'Moov', msisdn: '+225****0909', reference: 'REF-004', createdAt: new Date(Date.now() - 10800000).toISOString() },
          { id: '5', amount: 10000, currency: 'XOF', status: 'completed', type: 'collection', provider: 'Orange Money', operator: 'Orange', msisdn: '+225****0708', reference: 'REF-005', createdAt: new Date(Date.now() - 14400000).toISOString() },
        ],
        revenueByDay: [
          { date: 'Mon', amount: 450000 },
          { date: 'Tue', amount: 520000 },
          { date: 'Wed', amount: 480000 },
          { date: 'Thu', amount: 610000 },
          { date: 'Fri', amount: 550000 },
          { date: 'Sat', amount: 390000 },
          { date: 'Sun', amount: 320000 },
        ],
        transactionsByStatus: [
          { status: 'Completed', count: 11000 },
          { status: 'Pending', count: 800 },
          { status: 'Failed', count: 500 },
          { status: 'Processing', count: 200 },
          { status: 'Cancelled', count: 43 },
        ],
      },
    })
  }

  async applications({ inertia }: HttpContext) {
    return inertia.render('admin/Applications/List', {})
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
