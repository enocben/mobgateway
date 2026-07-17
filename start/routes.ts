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
router
  .group(() => {
    // Auth
    router.post('/auth/register', [controllers.Auth, 'register'])
    router.post('/auth/login', [controllers.Auth, 'login'])
    router.post('/auth/refresh', [controllers.Auth, 'refresh'])
  })
  .prefix('/api/v1')

// Authenticated API routes
router
  .group(() => {})
  .prefix('/api/v1')
  .use(middleware.auth())

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
    router.get('/', [controllers.Admin, 'index']).as('admin')
    router.get('/dashboard', [controllers.Admin, 'dashboard']).as('admin.dashboard')
    router.get('/applications', [controllers.Admin, 'applications']).as('admin.applications')
    router
      .get('/applications/create', [controllers.Admin, 'applicationsCreate'])
      .as('admin.applications.create')
    router
      .get('/applications/:appId', [controllers.Admin, 'applicationsDetail'])
      .as('admin.applications.detail')
    router.get('/settings', [controllers.Admin, 'settings']).as('admin.settings')
  })
  .prefix('/admin')
  .use(middleware.auth())

router
  .group(() => {
    // Applications
    router.get('/edit', [controllers.Admin, 'applicationsEdit']).as('admin.applications.edit')

    // Settings
    router.get('/settings', [controllers.Admin, 'settings']).as('admin.app.settings')
    router.put('/settings', [controllers.Admin, 'settingsUpdate']).as('admin.app.settings.update')
    router
      .post('/settings/api-key', [controllers.ApiKeys, 'generateApiKey'])
      .as('admin.app.settings.api-key.generate')
    router
      .delete('/settings/api-key/:keyId', [controllers.Admin, 'settingsDestroyApiKey'])
      .as('admin.app.settings.api-key.destroy')

    // Users
    router.get('/users', [controllers.Admin, 'users']).as('admin.users')
    router.get('/users/:userId', [controllers.Admin, 'usersDetail']).as('admin.users.detail')

    // Providers
    router.get('/providers', [controllers.Providers, 'index']).as('admin.providers')
    router
      .get('/providers/:providerId', [controllers.Providers, 'providersDetail'])
      .as('admin.providers.detail')
    router
      .post('/providers/:providerId/countries/:countryId', [
        controllers.Providers,
        'createProvider',
      ])
      .as('admin.providers.countries.store')
    router
      .delete('/providers/:providerId/countries/:countryId', [
        controllers.Providers,
        'providersDestroyCountry',
      ])
      .as('admin.providers.countries.destroy')
    router
      .post('/providers/:providerId/routes', [controllers.Providers, 'storeProviderRoute'])
      .as('admin.providers.routes.store')
    router
      .delete('/providers/:providerId/routes/:routeId', [
        controllers.Providers,
        'destroyProviderRoute',
      ])
      .as('admin.providers.routes.destroy')

    // Mobile Operators
    router
      .get('/mobile-operators', [controllers.MobileOperators, 'index'])
      .as('admin.mobile-operators')
    router
      .post('/mobile-operators', [controllers.MobileOperators, 'store'])
      .as('admin.mobile-operators.store')
    router
      .put('/mobile-operators/:operatorId', [controllers.MobileOperators, 'update'])
      .as('admin.mobile-operators.update')
    router
      .delete('/mobile-operators/:operatorId', [controllers.MobileOperators, 'destroy'])
      .as('admin.mobile-operators.destroy')

    // Countries
    router.get('/countries', [controllers.Countries, 'countries']).as('admin.countries')
    router
      .post('/countries/create/:iso2', [controllers.Countries, 'create'])
      .as('admin.countries.create')
    router
      .delete('/countries/:countryId', [controllers.Countries, 'destroy'])
      .as('admin.countries.delete')

    // Transactions
    router.get('/transactions', [controllers.Admin, 'transactions']).as('admin.transactions')

    // Webhooks
    router.get('/webhooks', [controllers.Admin, 'webhooks']).as('admin.webhooks')

    // Commissions
    router.get('/commissions', [controllers.Admin, 'commissions']).as('admin.commissions')

    // Routing
    router.get('/routing', [controllers.Admin, 'routing']).as('admin.routing')

    // Logs
    router.get('/logs', [controllers.Admin, 'logs']).as('admin.logs')
  })
  .prefix('/admin/:id')
  .use(middleware.auth())
