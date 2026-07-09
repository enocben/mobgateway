/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

router.on('/').renderInertia('home', {}).as('home')

// Health check
router.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }))

// API routes for external clients
router.group(() => {
  // Auth
  router.post('/auth/register', [controllers.Auth, 'register'])
  router.post('/auth/login', [controllers.Auth, 'login'])
  router.post('/auth/refresh', [controllers.Auth, 'refresh'])
}).prefix('/api/v1')

// Authenticated API routes
router.group(() => {
  router.get('/auth/me', [controllers.Auth, 'me'])
  router.post('/auth/logout', [controllers.Auth, 'logout'])
  router.get('/dashboard/stats', [controllers.Dashboard, 'getStats'])

  // Applications
  router.get('/applications', [controllers.Applications, 'index'])
  router.post('/applications', [controllers.Applications, 'store'])
  router.get('/applications/:id', [controllers.Applications, 'show'])
  router.put('/applications/:id', [controllers.Applications, 'update'])
  router.delete('/applications/:id', [controllers.Applications, 'destroy'])
  router.get('/applications/:id/stats', [controllers.Applications, 'stats'])

  // API Keys
  router.get('/applications/:application_id/api-keys', [controllers.ApiKeys, 'index'])
  router.post('/applications/:application_id/api-keys', [controllers.ApiKeys, 'store'])
  router.get('/applications/:application_id/api-keys/:id', [controllers.ApiKeys, 'show'])
  router.delete('/applications/:application_id/api-keys/:id', [controllers.ApiKeys, 'destroy'])

  // Countries
  router.get('/countries', [controllers.Countries, 'index'])
  router.post('/countries', [controllers.Countries, 'store'])
  router.get('/countries/:code', [controllers.Countries, 'show'])
  router.put('/countries/:code', [controllers.Countries, 'update'])
  router.delete('/countries/:code', [controllers.Countries, 'destroy'])

  // Currencies
  router.get('/currencies', [controllers.Currencies, 'index'])
  router.post('/currencies', [controllers.Currencies, 'store'])
  router.get('/currencies/:code', [controllers.Currencies, 'show'])
  router.put('/currencies/:code', [controllers.Currencies, 'update'])
  router.delete('/currencies/:code', [controllers.Currencies, 'destroy'])

  // Mobile Operators
  router.get('/mobile-operators', [controllers.MobileOperators, 'index'])
  router.post('/mobile-operators', [controllers.MobileOperators, 'store'])
  router.get('/mobile-operators/:id', [controllers.MobileOperators, 'show'])
  router.put('/mobile-operators/:id', [controllers.MobileOperators, 'update'])
  router.delete('/mobile-operators/:id', [controllers.MobileOperators, 'destroy'])

  // Operator Prefixes
  router.get('/mobile-operators/:mobile_operator_id/prefixes', [controllers.OperatorPrefixes, 'index'])
  router.post('/mobile-operators/:mobile_operator_id/prefixes', [controllers.OperatorPrefixes, 'store'])
  router.delete('/mobile-operators/:mobile_operator_id/prefixes/:id', [controllers.OperatorPrefixes, 'destroy'])

  // Providers (global registry)
  router.get('/providers', [controllers.Providers, 'index'])
  router.post('/providers', [controllers.Providers, 'store'])
  router.get('/providers/:id', [controllers.Providers, 'show'])
  router.put('/providers/:id', [controllers.Providers, 'update'])
  router.delete('/providers/:id', [controllers.Providers, 'destroy'])
  router.post('/providers/:id/test', [controllers.Providers, 'testConnection'])
  router.get('/providers/:id/stats', [controllers.Providers, 'stats'])

/*
  // Application Providers (per-app config)
  router.get('/applications/:application_id/providers', [controllers.ApplicationProviders, 'index'])
  router.post('/applications/:application_id/providers', [controllers.ApplicationProviders, 'store'])
  router.put('/applications/:application_id/providers/:id', [controllers.ApplicationProviders, 'update'])
  router.delete('/applications/:application_id/providers/:id', [controllers.ApplicationProviders, 'destroy'])
*/

  // Provider Routes
  router.get('/provider-routes', [controllers.ProviderRoutes, 'index'])
  router.post('/provider-routes', [controllers.ProviderRoutes, 'store'])
  router.get('/provider-routes/:id', [controllers.ProviderRoutes, 'show'])
  router.put('/provider-routes/:id', [controllers.ProviderRoutes, 'update'])
  router.delete('/provider-routes/:id', [controllers.ProviderRoutes, 'destroy'])

  // Transactions
  router.get('/transactions', [controllers.Transactions, 'index'])
  router.post('/transactions', [controllers.Transactions, 'store'])
  router.get('/transactions/:id', [controllers.Transactions, 'show'])
  router.post('/transactions/:id/retry', [controllers.Transactions, 'retry'])
  router.post('/transactions/:id/cancel', [controllers.Transactions, 'cancel'])
  router.get('/transactions/export/csv', [controllers.Transactions, 'exportCsv'])

  // Webhooks
  router.get('/webhooks', [controllers.Webhooks, 'index'])
  router.post('/webhooks', [controllers.Webhooks, 'store'])
  router.get('/webhooks/:id', [controllers.Webhooks, 'show'])
  router.put('/webhooks/:id', [controllers.Webhooks, 'update'])
  router.delete('/webhooks/:id', [controllers.Webhooks, 'destroy'])
  router.get('/webhooks/:id/deliveries', [controllers.Webhooks, 'deliveries'])
  router.post('/webhooks/:id/deliveries/:delivery_id/retry', [controllers.Webhooks, 'retryDelivery'])

  // Commissions
  router.get('/commissions', [controllers.Commissions, 'index'])
  router.post('/commissions', [controllers.Commissions, 'store'])
  router.get('/commissions/:id', [controllers.Commissions, 'show'])
  router.put('/commissions/:id', [controllers.Commissions, 'update'])
  router.delete('/commissions/:id', [controllers.Commissions, 'destroy'])

  // Audit Logs
  router.get('/audit-logs', [controllers.AuditLogs, 'index'])
  router.get('/audit-logs/:id', [controllers.AuditLogs, 'show'])

  // Users
  router.get('/users', [controllers.Users, 'index'])
  router.post('/users', [controllers.Users, 'store'])
  router.get('/users/:id', [controllers.Users, 'show'])
  router.put('/users/:id', [controllers.Users, 'update'])
  router.delete('/users/:id', [controllers.Users, 'destroy'])
  router.patch('/users/:id/suspend', [controllers.Users, 'suspend'])
  router.patch('/users/:id/activate', [controllers.Users, 'activate'])

  // Accounts (read-only ledger view)
  router.get('/accounts', [controllers.Accounts, 'index'])
  router.get('/accounts/:id', [controllers.Accounts, 'show'])

  // Ledger Entries (read-only)
  router.get('/ledger-entries', [controllers.LedgerEntries, 'index'])
  router.get('/ledger-entries/:id', [controllers.LedgerEntries, 'show'])

  // Reconciliation
  router.get('/reconciliation', [controllers.Reconciliation, 'index'])
  router.get('/reconciliation/:id', [controllers.Reconciliation, 'show'])
  router.post('/reconciliation/upload', [controllers.Reconciliation, 'upload'])
  router.post('/reconciliation/match', [controllers.Reconciliation, 'match'])
  router.post('/reconciliation/run', [controllers.Reconciliation, 'runReconciliation'])

  // Routing
  router.post('/routing/resolve', [controllers.Routing, 'resolveProvider'])
  router.get('/monitoring/providers', [controllers.Monitoring, 'getProviderHealth'])
  router.get('/monitoring/queues', [controllers.Monitoring, 'getQueueStats'])
}).prefix('/api/v1').use(middleware.auth())

router
  .group(() => {
    router.get('signup', [controllers.NewAccount, 'create'])
    router.post('signup', [controllers.NewAccount, 'store'])

    router.get('login', [controllers.Session, 'create'])
    router.post('login', [controllers.Session, 'store'])
  })
  .use(middleware.guest())

router
  .group(() => {
    router.post('logout', [controllers.Session, 'destroy'])
  })
  .use(middleware.auth())

// Admin routes
router
  .group(() => {
    router.get('/admin', [controllers.Admin, 'index']).as('admin')
    router.get('/admin/dashboard', [controllers.Admin, 'dashboard']).as('admin.dashboard')

    // Applications
    router.get('/admin/applications', [controllers.Admin, 'applications']).as('admin.applications')
    router.get('/admin/applications/create', [controllers.Admin, 'applicationsCreate']).as('admin.applications.create')
    router.get('/admin/applications/:id/edit', [controllers.Admin, 'applicationsEdit']).as('admin.applications.edit')
    router.get('/admin/applications/:id', [controllers.Admin, 'applicationsDetail']).as('admin.applications.detail')

    // Users
    router.get('/admin/users', [controllers.Admin, 'users']).as('admin.users')
    router.get('/admin/users/:id', [controllers.Admin, 'usersDetail']).as('admin.users.detail')

    // Providers
    router.get('/admin/providers', [controllers.Admin, 'providers']).as('admin.providers')
    router.get('/admin/providers/create', [controllers.Admin, 'providersCreate']).as('admin.providers.create')
    router.get('/admin/providers/:id', [controllers.Admin, 'providersDetail']).as('admin.providers.detail')

    // Mobile Operators
    router.get('/admin/mobile-operators', [controllers.Admin, 'mobileOperators']).as('admin.mobile-operators')

    // Countries
    router.get('/admin/countries', [controllers.Admin, 'countries']).as('admin.countries')

    // Currencies
    router.get('/admin/currencies', [controllers.Admin, 'currencies']).as('admin.currencies')

    // Transactions
    router.get('/admin/transactions', [controllers.Admin, 'transactions']).as('admin.transactions')

    // Webhooks
    router.get('/admin/webhooks', [controllers.Admin, 'webhooks']).as('admin.webhooks')

    // Commissions
    router.get('/admin/commissions', [controllers.Admin, 'commissions']).as('admin.commissions')

    // Routing
    router.get('/admin/routing', [controllers.Admin, 'routing']).as('admin.routing')

    // Logs
    router.get('/admin/logs', [controllers.Admin, 'logs']).as('admin.logs')

    // Settings
    router.get('/admin/settings', [controllers.Admin, 'settings']).as('admin.settings')
  })
  .use(middleware.auth())
