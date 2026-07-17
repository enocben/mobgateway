/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'home': {
    methods: ["GET","HEAD"]
    pattern: '/'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'auth.register': {
    methods: ["POST"]
    pattern: '/api/v1/auth/register'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['register']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['register']>>>
    }
  }
  'auth.login': {
    methods: ["POST"]
    pattern: '/api/v1/auth/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['login']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['login']>>>
    }
  }
  'auth.refresh': {
    methods: ["POST"]
    pattern: '/api/v1/auth/refresh'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['refresh']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['refresh']>>>
    }
  }
  'new_account.create': {
    methods: ["GET","HEAD"]
    pattern: '/signup'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['create']>>>
    }
  }
  'new_account.store': {
    methods: ["POST"]
    pattern: '/signup'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').signupValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').signupValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'session.create': {
    methods: ["GET","HEAD"]
    pattern: '/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['create']>>>
    }
  }
  'session.store': {
    methods: ["POST"]
    pattern: '/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['store']>>>
    }
  }
  'session.destroy': {
    methods: ["POST"]
    pattern: '/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>>
    }
  }
  'admin': {
    methods: ["GET","HEAD"]
    pattern: '/admin'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['index']>>>
    }
  }
  'admin.dashboard': {
    methods: ["GET","HEAD"]
    pattern: '/admin/dashboard'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['dashboard']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['dashboard']>>>
    }
  }
  'admin.applications': {
    methods: ["GET","HEAD"]
    pattern: '/admin/applications'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['applications']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['applications']>>>
    }
  }
  'admin.applications.create': {
    methods: ["GET","HEAD"]
    pattern: '/admin/applications/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['applicationsCreate']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['applicationsCreate']>>>
    }
  }
  'admin.applications.detail': {
    methods: ["GET","HEAD"]
    pattern: '/admin/applications/:appId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { appId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['applicationsDetail']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['applicationsDetail']>>>
    }
  }
  'admin.settings': {
    methods: ["GET","HEAD"]
    pattern: '/admin/settings'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['settings']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['settings']>>>
    }
  }
  'admin.applications.edit': {
    methods: ["GET","HEAD"]
    pattern: '/admin/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['applicationsEdit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['applicationsEdit']>>>
    }
  }
  'admin.app.settings': {
    methods: ["GET","HEAD"]
    pattern: '/admin/:id/settings'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['settings']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['settings']>>>
    }
  }
  'admin.app.settings.update': {
    methods: ["PUT"]
    pattern: '/admin/:id/settings'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['settingsUpdate']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['settingsUpdate']>>>
    }
  }
  'admin.app.settings.api-key.generate': {
    methods: ["POST"]
    pattern: '/admin/:id/settings/api-key'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/api_key').createApiKeyValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/api_key').createApiKeyValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/api_keys_controller').default['generateApiKey']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/api_keys_controller').default['generateApiKey']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.app.settings.api-key.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/:id/settings/api-key/:keyId'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { id: ParamValue; keyId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['settingsDestroyApiKey']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['settingsDestroyApiKey']>>>
    }
  }
  'admin.users': {
    methods: ["GET","HEAD"]
    pattern: '/admin/:id/users'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['users']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['users']>>>
    }
  }
  'admin.users.detail': {
    methods: ["GET","HEAD"]
    pattern: '/admin/:id/users/:userId'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { id: ParamValue; userId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['usersDetail']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['usersDetail']>>>
    }
  }
  'admin.providers': {
    methods: ["GET","HEAD"]
    pattern: '/admin/:id/providers'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/providers_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/providers_controller').default['index']>>>
    }
  }
  'admin.providers.detail': {
    methods: ["GET","HEAD"]
    pattern: '/admin/:id/providers/:providerId'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { id: ParamValue; providerId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/providers_controller').default['providersDetail']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/providers_controller').default['providersDetail']>>>
    }
  }
  'admin.providers.countries.store': {
    methods: ["POST"]
    pattern: '/admin/:id/providers/:providerId/countries/:countryId'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue, ParamValue]
      params: { id: ParamValue; providerId: ParamValue; countryId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/providers_controller').default['createProvider']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/providers_controller').default['createProvider']>>>
    }
  }
  'admin.providers.countries.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/:id/providers/:providerId/countries/:countryId'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue, ParamValue]
      params: { id: ParamValue; providerId: ParamValue; countryId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/providers_controller').default['providersDestroyCountry']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/providers_controller').default['providersDestroyCountry']>>>
    }
  }
  'admin.providers.routes.store': {
    methods: ["POST"]
    pattern: '/admin/:id/providers/:providerId/routes'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/provider').storeProviderRouteValidator)>>
      paramsTuple: [ParamValue, ParamValue]
      params: { id: ParamValue; providerId: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/provider').storeProviderRouteValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/providers_controller').default['storeProviderRoute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/providers_controller').default['storeProviderRoute']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.providers.routes.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/:id/providers/:providerId/routes/:routeId'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue, ParamValue]
      params: { id: ParamValue; providerId: ParamValue; routeId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/providers_controller').default['destroyProviderRoute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/providers_controller').default['destroyProviderRoute']>>>
    }
  }
  'admin.mobile-operators': {
    methods: ["GET","HEAD"]
    pattern: '/admin/:id/mobile-operators'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/mobile_operators_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/mobile_operators_controller').default['index']>>>
    }
  }
  'admin.mobile-operators.store': {
    methods: ["POST"]
    pattern: '/admin/:id/mobile-operators'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/mobile_operator').createMobileOperatorValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/mobile_operator').createMobileOperatorValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/mobile_operators_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/mobile_operators_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.mobile-operators.update': {
    methods: ["PUT"]
    pattern: '/admin/:id/mobile-operators/:operatorId'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/mobile_operator').updateMobileOperatorValidator)>>
      paramsTuple: [ParamValue, ParamValue]
      params: { id: ParamValue; operatorId: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/mobile_operator').updateMobileOperatorValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/mobile_operators_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/mobile_operators_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.mobile-operators.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/:id/mobile-operators/:operatorId'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { id: ParamValue; operatorId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/mobile_operators_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/mobile_operators_controller').default['destroy']>>>
    }
  }
  'admin.countries': {
    methods: ["GET","HEAD"]
    pattern: '/admin/:id/countries'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/countries_controller').default['countries']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/countries_controller').default['countries']>>>
    }
  }
  'admin.countries.create': {
    methods: ["POST"]
    pattern: '/admin/:id/countries/create/:iso2'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { id: ParamValue; iso2: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/countries_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/countries_controller').default['create']>>>
    }
  }
  'admin.countries.delete': {
    methods: ["DELETE"]
    pattern: '/admin/:id/countries/:countryId'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { id: ParamValue; countryId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/countries_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/countries_controller').default['destroy']>>>
    }
  }
  'admin.transactions': {
    methods: ["GET","HEAD"]
    pattern: '/admin/:id/transactions'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['transactions']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['transactions']>>>
    }
  }
  'admin.webhooks': {
    methods: ["GET","HEAD"]
    pattern: '/admin/:id/webhooks'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['webhooks']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['webhooks']>>>
    }
  }
  'admin.commissions': {
    methods: ["GET","HEAD"]
    pattern: '/admin/:id/commissions'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['commissions']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['commissions']>>>
    }
  }
  'admin.routing': {
    methods: ["GET","HEAD"]
    pattern: '/admin/:id/routing'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['routing']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['routing']>>>
    }
  }
  'admin.logs': {
    methods: ["GET","HEAD"]
    pattern: '/admin/:id/logs'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['logs']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['logs']>>>
    }
  }
}
