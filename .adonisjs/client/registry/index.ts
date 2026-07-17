/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'home': {
    methods: ["GET","HEAD"],
    pattern: '/',
    tokens: [{"old":"/","type":0,"val":"/","end":""}],
    types: placeholder as Registry['home']['types'],
  },
  'auth.register': {
    methods: ["POST"],
    pattern: '/api/v1/auth/register',
    tokens: [{"old":"/api/v1/auth/register","type":0,"val":"api","end":""},{"old":"/api/v1/auth/register","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/register","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/register","type":0,"val":"register","end":""}],
    types: placeholder as Registry['auth.register']['types'],
  },
  'auth.login': {
    methods: ["POST"],
    pattern: '/api/v1/auth/login',
    tokens: [{"old":"/api/v1/auth/login","type":0,"val":"api","end":""},{"old":"/api/v1/auth/login","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/login","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['auth.login']['types'],
  },
  'auth.refresh': {
    methods: ["POST"],
    pattern: '/api/v1/auth/refresh',
    tokens: [{"old":"/api/v1/auth/refresh","type":0,"val":"api","end":""},{"old":"/api/v1/auth/refresh","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/refresh","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/refresh","type":0,"val":"refresh","end":""}],
    types: placeholder as Registry['auth.refresh']['types'],
  },
  'new_account.create': {
    methods: ["GET","HEAD"],
    pattern: '/signup',
    tokens: [{"old":"/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['new_account.create']['types'],
  },
  'new_account.store': {
    methods: ["POST"],
    pattern: '/signup',
    tokens: [{"old":"/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['new_account.store']['types'],
  },
  'session.create': {
    methods: ["GET","HEAD"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.create']['types'],
  },
  'session.store': {
    methods: ["POST"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.store']['types'],
  },
  'session.destroy': {
    methods: ["POST"],
    pattern: '/logout',
    tokens: [{"old":"/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['session.destroy']['types'],
  },
  'admin': {
    methods: ["GET","HEAD"],
    pattern: '/admin',
    tokens: [{"old":"/admin","type":0,"val":"admin","end":""}],
    types: placeholder as Registry['admin']['types'],
  },
  'admin.dashboard': {
    methods: ["GET","HEAD"],
    pattern: '/admin/dashboard',
    tokens: [{"old":"/admin/dashboard","type":0,"val":"admin","end":""},{"old":"/admin/dashboard","type":0,"val":"dashboard","end":""}],
    types: placeholder as Registry['admin.dashboard']['types'],
  },
  'admin.applications': {
    methods: ["GET","HEAD"],
    pattern: '/admin/applications',
    tokens: [{"old":"/admin/applications","type":0,"val":"admin","end":""},{"old":"/admin/applications","type":0,"val":"applications","end":""}],
    types: placeholder as Registry['admin.applications']['types'],
  },
  'admin.applications.create': {
    methods: ["GET","HEAD"],
    pattern: '/admin/applications/create',
    tokens: [{"old":"/admin/applications/create","type":0,"val":"admin","end":""},{"old":"/admin/applications/create","type":0,"val":"applications","end":""},{"old":"/admin/applications/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['admin.applications.create']['types'],
  },
  'admin.applications.detail': {
    methods: ["GET","HEAD"],
    pattern: '/admin/applications/:appId',
    tokens: [{"old":"/admin/applications/:appId","type":0,"val":"admin","end":""},{"old":"/admin/applications/:appId","type":0,"val":"applications","end":""},{"old":"/admin/applications/:appId","type":1,"val":"appId","end":""}],
    types: placeholder as Registry['admin.applications.detail']['types'],
  },
  'admin.settings': {
    methods: ["GET","HEAD"],
    pattern: '/admin/settings',
    tokens: [{"old":"/admin/settings","type":0,"val":"admin","end":""},{"old":"/admin/settings","type":0,"val":"settings","end":""}],
    types: placeholder as Registry['admin.settings']['types'],
  },
  'admin.applications.edit': {
    methods: ["GET","HEAD"],
    pattern: '/admin/:id/edit',
    tokens: [{"old":"/admin/:id/edit","type":0,"val":"admin","end":""},{"old":"/admin/:id/edit","type":1,"val":"id","end":""},{"old":"/admin/:id/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['admin.applications.edit']['types'],
  },
  'admin.app.settings': {
    methods: ["GET","HEAD"],
    pattern: '/admin/:id/settings',
    tokens: [{"old":"/admin/:id/settings","type":0,"val":"admin","end":""},{"old":"/admin/:id/settings","type":1,"val":"id","end":""},{"old":"/admin/:id/settings","type":0,"val":"settings","end":""}],
    types: placeholder as Registry['admin.app.settings']['types'],
  },
  'admin.app.settings.update': {
    methods: ["PUT"],
    pattern: '/admin/:id/settings',
    tokens: [{"old":"/admin/:id/settings","type":0,"val":"admin","end":""},{"old":"/admin/:id/settings","type":1,"val":"id","end":""},{"old":"/admin/:id/settings","type":0,"val":"settings","end":""}],
    types: placeholder as Registry['admin.app.settings.update']['types'],
  },
  'admin.app.settings.api-key.generate': {
    methods: ["POST"],
    pattern: '/admin/:id/settings/api-key',
    tokens: [{"old":"/admin/:id/settings/api-key","type":0,"val":"admin","end":""},{"old":"/admin/:id/settings/api-key","type":1,"val":"id","end":""},{"old":"/admin/:id/settings/api-key","type":0,"val":"settings","end":""},{"old":"/admin/:id/settings/api-key","type":0,"val":"api-key","end":""}],
    types: placeholder as Registry['admin.app.settings.api-key.generate']['types'],
  },
  'admin.app.settings.api-key.destroy': {
    methods: ["DELETE"],
    pattern: '/admin/:id/settings/api-key/:keyId',
    tokens: [{"old":"/admin/:id/settings/api-key/:keyId","type":0,"val":"admin","end":""},{"old":"/admin/:id/settings/api-key/:keyId","type":1,"val":"id","end":""},{"old":"/admin/:id/settings/api-key/:keyId","type":0,"val":"settings","end":""},{"old":"/admin/:id/settings/api-key/:keyId","type":0,"val":"api-key","end":""},{"old":"/admin/:id/settings/api-key/:keyId","type":1,"val":"keyId","end":""}],
    types: placeholder as Registry['admin.app.settings.api-key.destroy']['types'],
  },
  'admin.users': {
    methods: ["GET","HEAD"],
    pattern: '/admin/:id/users',
    tokens: [{"old":"/admin/:id/users","type":0,"val":"admin","end":""},{"old":"/admin/:id/users","type":1,"val":"id","end":""},{"old":"/admin/:id/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['admin.users']['types'],
  },
  'admin.users.detail': {
    methods: ["GET","HEAD"],
    pattern: '/admin/:id/users/:userId',
    tokens: [{"old":"/admin/:id/users/:userId","type":0,"val":"admin","end":""},{"old":"/admin/:id/users/:userId","type":1,"val":"id","end":""},{"old":"/admin/:id/users/:userId","type":0,"val":"users","end":""},{"old":"/admin/:id/users/:userId","type":1,"val":"userId","end":""}],
    types: placeholder as Registry['admin.users.detail']['types'],
  },
  'admin.providers': {
    methods: ["GET","HEAD"],
    pattern: '/admin/:id/providers',
    tokens: [{"old":"/admin/:id/providers","type":0,"val":"admin","end":""},{"old":"/admin/:id/providers","type":1,"val":"id","end":""},{"old":"/admin/:id/providers","type":0,"val":"providers","end":""}],
    types: placeholder as Registry['admin.providers']['types'],
  },
  'admin.providers.detail': {
    methods: ["GET","HEAD"],
    pattern: '/admin/:id/providers/:providerId',
    tokens: [{"old":"/admin/:id/providers/:providerId","type":0,"val":"admin","end":""},{"old":"/admin/:id/providers/:providerId","type":1,"val":"id","end":""},{"old":"/admin/:id/providers/:providerId","type":0,"val":"providers","end":""},{"old":"/admin/:id/providers/:providerId","type":1,"val":"providerId","end":""}],
    types: placeholder as Registry['admin.providers.detail']['types'],
  },
  'admin.providers.countries.store': {
    methods: ["POST"],
    pattern: '/admin/:id/providers/:providerId/countries/:countryId',
    tokens: [{"old":"/admin/:id/providers/:providerId/countries/:countryId","type":0,"val":"admin","end":""},{"old":"/admin/:id/providers/:providerId/countries/:countryId","type":1,"val":"id","end":""},{"old":"/admin/:id/providers/:providerId/countries/:countryId","type":0,"val":"providers","end":""},{"old":"/admin/:id/providers/:providerId/countries/:countryId","type":1,"val":"providerId","end":""},{"old":"/admin/:id/providers/:providerId/countries/:countryId","type":0,"val":"countries","end":""},{"old":"/admin/:id/providers/:providerId/countries/:countryId","type":1,"val":"countryId","end":""}],
    types: placeholder as Registry['admin.providers.countries.store']['types'],
  },
  'admin.providers.countries.destroy': {
    methods: ["DELETE"],
    pattern: '/admin/:id/providers/:providerId/countries/:countryId',
    tokens: [{"old":"/admin/:id/providers/:providerId/countries/:countryId","type":0,"val":"admin","end":""},{"old":"/admin/:id/providers/:providerId/countries/:countryId","type":1,"val":"id","end":""},{"old":"/admin/:id/providers/:providerId/countries/:countryId","type":0,"val":"providers","end":""},{"old":"/admin/:id/providers/:providerId/countries/:countryId","type":1,"val":"providerId","end":""},{"old":"/admin/:id/providers/:providerId/countries/:countryId","type":0,"val":"countries","end":""},{"old":"/admin/:id/providers/:providerId/countries/:countryId","type":1,"val":"countryId","end":""}],
    types: placeholder as Registry['admin.providers.countries.destroy']['types'],
  },
  'admin.providers.routes.store': {
    methods: ["POST"],
    pattern: '/admin/:id/providers/:providerId/routes',
    tokens: [{"old":"/admin/:id/providers/:providerId/routes","type":0,"val":"admin","end":""},{"old":"/admin/:id/providers/:providerId/routes","type":1,"val":"id","end":""},{"old":"/admin/:id/providers/:providerId/routes","type":0,"val":"providers","end":""},{"old":"/admin/:id/providers/:providerId/routes","type":1,"val":"providerId","end":""},{"old":"/admin/:id/providers/:providerId/routes","type":0,"val":"routes","end":""}],
    types: placeholder as Registry['admin.providers.routes.store']['types'],
  },
  'admin.providers.routes.destroy': {
    methods: ["DELETE"],
    pattern: '/admin/:id/providers/:providerId/routes/:routeId',
    tokens: [{"old":"/admin/:id/providers/:providerId/routes/:routeId","type":0,"val":"admin","end":""},{"old":"/admin/:id/providers/:providerId/routes/:routeId","type":1,"val":"id","end":""},{"old":"/admin/:id/providers/:providerId/routes/:routeId","type":0,"val":"providers","end":""},{"old":"/admin/:id/providers/:providerId/routes/:routeId","type":1,"val":"providerId","end":""},{"old":"/admin/:id/providers/:providerId/routes/:routeId","type":0,"val":"routes","end":""},{"old":"/admin/:id/providers/:providerId/routes/:routeId","type":1,"val":"routeId","end":""}],
    types: placeholder as Registry['admin.providers.routes.destroy']['types'],
  },
  'admin.mobile-operators': {
    methods: ["GET","HEAD"],
    pattern: '/admin/:id/mobile-operators',
    tokens: [{"old":"/admin/:id/mobile-operators","type":0,"val":"admin","end":""},{"old":"/admin/:id/mobile-operators","type":1,"val":"id","end":""},{"old":"/admin/:id/mobile-operators","type":0,"val":"mobile-operators","end":""}],
    types: placeholder as Registry['admin.mobile-operators']['types'],
  },
  'admin.mobile-operators.store': {
    methods: ["POST"],
    pattern: '/admin/:id/mobile-operators',
    tokens: [{"old":"/admin/:id/mobile-operators","type":0,"val":"admin","end":""},{"old":"/admin/:id/mobile-operators","type":1,"val":"id","end":""},{"old":"/admin/:id/mobile-operators","type":0,"val":"mobile-operators","end":""}],
    types: placeholder as Registry['admin.mobile-operators.store']['types'],
  },
  'admin.mobile-operators.update': {
    methods: ["PUT"],
    pattern: '/admin/:id/mobile-operators/:operatorId',
    tokens: [{"old":"/admin/:id/mobile-operators/:operatorId","type":0,"val":"admin","end":""},{"old":"/admin/:id/mobile-operators/:operatorId","type":1,"val":"id","end":""},{"old":"/admin/:id/mobile-operators/:operatorId","type":0,"val":"mobile-operators","end":""},{"old":"/admin/:id/mobile-operators/:operatorId","type":1,"val":"operatorId","end":""}],
    types: placeholder as Registry['admin.mobile-operators.update']['types'],
  },
  'admin.mobile-operators.destroy': {
    methods: ["DELETE"],
    pattern: '/admin/:id/mobile-operators/:operatorId',
    tokens: [{"old":"/admin/:id/mobile-operators/:operatorId","type":0,"val":"admin","end":""},{"old":"/admin/:id/mobile-operators/:operatorId","type":1,"val":"id","end":""},{"old":"/admin/:id/mobile-operators/:operatorId","type":0,"val":"mobile-operators","end":""},{"old":"/admin/:id/mobile-operators/:operatorId","type":1,"val":"operatorId","end":""}],
    types: placeholder as Registry['admin.mobile-operators.destroy']['types'],
  },
  'admin.countries': {
    methods: ["GET","HEAD"],
    pattern: '/admin/:id/countries',
    tokens: [{"old":"/admin/:id/countries","type":0,"val":"admin","end":""},{"old":"/admin/:id/countries","type":1,"val":"id","end":""},{"old":"/admin/:id/countries","type":0,"val":"countries","end":""}],
    types: placeholder as Registry['admin.countries']['types'],
  },
  'admin.countries.create': {
    methods: ["POST"],
    pattern: '/admin/:id/countries/create/:iso2',
    tokens: [{"old":"/admin/:id/countries/create/:iso2","type":0,"val":"admin","end":""},{"old":"/admin/:id/countries/create/:iso2","type":1,"val":"id","end":""},{"old":"/admin/:id/countries/create/:iso2","type":0,"val":"countries","end":""},{"old":"/admin/:id/countries/create/:iso2","type":0,"val":"create","end":""},{"old":"/admin/:id/countries/create/:iso2","type":1,"val":"iso2","end":""}],
    types: placeholder as Registry['admin.countries.create']['types'],
  },
  'admin.countries.delete': {
    methods: ["DELETE"],
    pattern: '/admin/:id/countries/:countryId',
    tokens: [{"old":"/admin/:id/countries/:countryId","type":0,"val":"admin","end":""},{"old":"/admin/:id/countries/:countryId","type":1,"val":"id","end":""},{"old":"/admin/:id/countries/:countryId","type":0,"val":"countries","end":""},{"old":"/admin/:id/countries/:countryId","type":1,"val":"countryId","end":""}],
    types: placeholder as Registry['admin.countries.delete']['types'],
  },
  'admin.transactions': {
    methods: ["GET","HEAD"],
    pattern: '/admin/:id/transactions',
    tokens: [{"old":"/admin/:id/transactions","type":0,"val":"admin","end":""},{"old":"/admin/:id/transactions","type":1,"val":"id","end":""},{"old":"/admin/:id/transactions","type":0,"val":"transactions","end":""}],
    types: placeholder as Registry['admin.transactions']['types'],
  },
  'admin.webhooks': {
    methods: ["GET","HEAD"],
    pattern: '/admin/:id/webhooks',
    tokens: [{"old":"/admin/:id/webhooks","type":0,"val":"admin","end":""},{"old":"/admin/:id/webhooks","type":1,"val":"id","end":""},{"old":"/admin/:id/webhooks","type":0,"val":"webhooks","end":""}],
    types: placeholder as Registry['admin.webhooks']['types'],
  },
  'admin.commissions': {
    methods: ["GET","HEAD"],
    pattern: '/admin/:id/commissions',
    tokens: [{"old":"/admin/:id/commissions","type":0,"val":"admin","end":""},{"old":"/admin/:id/commissions","type":1,"val":"id","end":""},{"old":"/admin/:id/commissions","type":0,"val":"commissions","end":""}],
    types: placeholder as Registry['admin.commissions']['types'],
  },
  'admin.routing': {
    methods: ["GET","HEAD"],
    pattern: '/admin/:id/routing',
    tokens: [{"old":"/admin/:id/routing","type":0,"val":"admin","end":""},{"old":"/admin/:id/routing","type":1,"val":"id","end":""},{"old":"/admin/:id/routing","type":0,"val":"routing","end":""}],
    types: placeholder as Registry['admin.routing']['types'],
  },
  'admin.logs': {
    methods: ["GET","HEAD"],
    pattern: '/admin/:id/logs',
    tokens: [{"old":"/admin/:id/logs","type":0,"val":"admin","end":""},{"old":"/admin/:id/logs","type":1,"val":"id","end":""},{"old":"/admin/:id/logs","type":0,"val":"logs","end":""}],
    types: placeholder as Registry['admin.logs']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
