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
  'auth.me': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/auth/me'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['me']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['me']>>>
    }
  }
  'auth.logout': {
    methods: ["POST"]
    pattern: '/api/v1/auth/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['logout']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['logout']>>>
    }
  }
  'dashboard.get_stats': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/dashboard/stats'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/dashboard_controller').default['getStats']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/dashboard_controller').default['getStats']>>>
    }
  }
  'applications.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/applications'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/applications_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/applications_controller').default['index']>>>
    }
  }
  'applications.store': {
    methods: ["POST"]
    pattern: '/api/v1/applications'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/applications_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/applications_controller').default['store']>>>
    }
  }
  'applications.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/applications/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/applications_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/applications_controller').default['show']>>>
    }
  }
  'applications.update': {
    methods: ["PUT"]
    pattern: '/api/v1/applications/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/applications_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/applications_controller').default['update']>>>
    }
  }
  'applications.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/applications/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/applications_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/applications_controller').default['destroy']>>>
    }
  }
  'applications.stats': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/applications/:id/stats'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/applications_controller').default['stats']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/applications_controller').default['stats']>>>
    }
  }
  'api_keys.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/applications/:application_id/api-keys'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { application_id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/api_keys_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/api_keys_controller').default['index']>>>
    }
  }
  'api_keys.store': {
    methods: ["POST"]
    pattern: '/api/v1/applications/:application_id/api-keys'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { application_id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/api_keys_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/api_keys_controller').default['store']>>>
    }
  }
  'api_keys.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/applications/:application_id/api-keys/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { application_id: ParamValue; id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/api_keys_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/api_keys_controller').default['show']>>>
    }
  }
  'api_keys.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/applications/:application_id/api-keys/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { application_id: ParamValue; id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/api_keys_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/api_keys_controller').default['destroy']>>>
    }
  }
  'countries.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/countries'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/countries_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/countries_controller').default['index']>>>
    }
  }
  'countries.store': {
    methods: ["POST"]
    pattern: '/api/v1/countries'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/countries_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/countries_controller').default['store']>>>
    }
  }
  'countries.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/countries/:code'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { code: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/countries_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/countries_controller').default['show']>>>
    }
  }
  'countries.update': {
    methods: ["PUT"]
    pattern: '/api/v1/countries/:code'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { code: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/countries_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/countries_controller').default['update']>>>
    }
  }
  'countries.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/countries/:code'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { code: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/countries_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/countries_controller').default['destroy']>>>
    }
  }
  'currencies.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/currencies'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/currencies_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/currencies_controller').default['index']>>>
    }
  }
  'currencies.store': {
    methods: ["POST"]
    pattern: '/api/v1/currencies'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/currencies_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/currencies_controller').default['store']>>>
    }
  }
  'currencies.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/currencies/:code'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { code: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/currencies_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/currencies_controller').default['show']>>>
    }
  }
  'currencies.update': {
    methods: ["PUT"]
    pattern: '/api/v1/currencies/:code'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { code: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/currencies_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/currencies_controller').default['update']>>>
    }
  }
  'currencies.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/currencies/:code'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { code: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/currencies_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/currencies_controller').default['destroy']>>>
    }
  }
  'mobile_operators.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/mobile-operators'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/mobile_operators_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/mobile_operators_controller').default['index']>>>
    }
  }
  'mobile_operators.store': {
    methods: ["POST"]
    pattern: '/api/v1/mobile-operators'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/mobile_operators_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/mobile_operators_controller').default['store']>>>
    }
  }
  'mobile_operators.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/mobile-operators/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/mobile_operators_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/mobile_operators_controller').default['show']>>>
    }
  }
  'mobile_operators.update': {
    methods: ["PUT"]
    pattern: '/api/v1/mobile-operators/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/mobile_operators_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/mobile_operators_controller').default['update']>>>
    }
  }
  'mobile_operators.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/mobile-operators/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/mobile_operators_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/mobile_operators_controller').default['destroy']>>>
    }
  }
  'operator_prefixes.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/mobile-operators/:mobile_operator_id/prefixes'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { mobile_operator_id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/operator_prefixes_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/operator_prefixes_controller').default['index']>>>
    }
  }
  'operator_prefixes.store': {
    methods: ["POST"]
    pattern: '/api/v1/mobile-operators/:mobile_operator_id/prefixes'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { mobile_operator_id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/operator_prefixes_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/operator_prefixes_controller').default['store']>>>
    }
  }
  'operator_prefixes.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/mobile-operators/:mobile_operator_id/prefixes/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { mobile_operator_id: ParamValue; id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/operator_prefixes_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/operator_prefixes_controller').default['destroy']>>>
    }
  }
  'providers.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/providers'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/providers_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/providers_controller').default['index']>>>
    }
  }
  'providers.store': {
    methods: ["POST"]
    pattern: '/api/v1/providers'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/providers_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/providers_controller').default['store']>>>
    }
  }
  'providers.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/providers/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/providers_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/providers_controller').default['show']>>>
    }
  }
  'providers.update': {
    methods: ["PUT"]
    pattern: '/api/v1/providers/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/providers_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/providers_controller').default['update']>>>
    }
  }
  'providers.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/providers/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/providers_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/providers_controller').default['destroy']>>>
    }
  }
  'providers.test_connection': {
    methods: ["POST"]
    pattern: '/api/v1/providers/:id/test'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/providers_controller').default['testConnection']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/providers_controller').default['testConnection']>>>
    }
  }
  'providers.stats': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/providers/:id/stats'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/providers_controller').default['stats']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/providers_controller').default['stats']>>>
    }
  }
  'provider_routes.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/provider-routes'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/provider_routes_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/provider_routes_controller').default['index']>>>
    }
  }
  'provider_routes.store': {
    methods: ["POST"]
    pattern: '/api/v1/provider-routes'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/provider_routes_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/provider_routes_controller').default['store']>>>
    }
  }
  'provider_routes.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/provider-routes/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/provider_routes_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/provider_routes_controller').default['show']>>>
    }
  }
  'provider_routes.update': {
    methods: ["PUT"]
    pattern: '/api/v1/provider-routes/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/provider_routes_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/provider_routes_controller').default['update']>>>
    }
  }
  'provider_routes.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/provider-routes/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/provider_routes_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/provider_routes_controller').default['destroy']>>>
    }
  }
  'transactions.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/transactions'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/transactions_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/transactions_controller').default['index']>>>
    }
  }
  'transactions.store': {
    methods: ["POST"]
    pattern: '/api/v1/transactions'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/transactions_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/transactions_controller').default['store']>>>
    }
  }
  'transactions.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/transactions/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/transactions_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/transactions_controller').default['show']>>>
    }
  }
  'transactions.retry': {
    methods: ["POST"]
    pattern: '/api/v1/transactions/:id/retry'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/transactions_controller').default['retry']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/transactions_controller').default['retry']>>>
    }
  }
  'transactions.cancel': {
    methods: ["POST"]
    pattern: '/api/v1/transactions/:id/cancel'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/transactions_controller').default['cancel']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/transactions_controller').default['cancel']>>>
    }
  }
  'transactions.export_csv': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/transactions/export/csv'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/transactions_controller').default['exportCsv']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/transactions_controller').default['exportCsv']>>>
    }
  }
  'webhooks.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/webhooks'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/webhooks_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/webhooks_controller').default['index']>>>
    }
  }
  'webhooks.store': {
    methods: ["POST"]
    pattern: '/api/v1/webhooks'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/webhooks_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/webhooks_controller').default['store']>>>
    }
  }
  'webhooks.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/webhooks/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/webhooks_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/webhooks_controller').default['show']>>>
    }
  }
  'webhooks.update': {
    methods: ["PUT"]
    pattern: '/api/v1/webhooks/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/webhooks_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/webhooks_controller').default['update']>>>
    }
  }
  'webhooks.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/webhooks/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/webhooks_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/webhooks_controller').default['destroy']>>>
    }
  }
  'webhooks.deliveries': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/webhooks/:id/deliveries'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/webhooks_controller').default['deliveries']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/webhooks_controller').default['deliveries']>>>
    }
  }
  'webhooks.retry_delivery': {
    methods: ["POST"]
    pattern: '/api/v1/webhooks/:id/deliveries/:delivery_id/retry'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { id: ParamValue; delivery_id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/webhooks_controller').default['retryDelivery']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/webhooks_controller').default['retryDelivery']>>>
    }
  }
  'commissions.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/commissions'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/commissions_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/commissions_controller').default['index']>>>
    }
  }
  'commissions.store': {
    methods: ["POST"]
    pattern: '/api/v1/commissions'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/commissions_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/commissions_controller').default['store']>>>
    }
  }
  'commissions.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/commissions/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/commissions_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/commissions_controller').default['show']>>>
    }
  }
  'commissions.update': {
    methods: ["PUT"]
    pattern: '/api/v1/commissions/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/commissions_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/commissions_controller').default['update']>>>
    }
  }
  'commissions.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/commissions/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/commissions_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/commissions_controller').default['destroy']>>>
    }
  }
  'audit_logs.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/audit-logs'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/audit_logs_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/audit_logs_controller').default['index']>>>
    }
  }
  'audit_logs.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/audit-logs/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/audit_logs_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/audit_logs_controller').default['show']>>>
    }
  }
  'users.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/users'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/users_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/users_controller').default['index']>>>
    }
  }
  'users.store': {
    methods: ["POST"]
    pattern: '/api/v1/users'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/users_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/users_controller').default['store']>>>
    }
  }
  'users.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/users/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/users_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/users_controller').default['show']>>>
    }
  }
  'users.update': {
    methods: ["PUT"]
    pattern: '/api/v1/users/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/users_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/users_controller').default['update']>>>
    }
  }
  'users.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/users/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/users_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/users_controller').default['destroy']>>>
    }
  }
  'users.suspend': {
    methods: ["PATCH"]
    pattern: '/api/v1/users/:id/suspend'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/users_controller').default['suspend']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/users_controller').default['suspend']>>>
    }
  }
  'users.activate': {
    methods: ["PATCH"]
    pattern: '/api/v1/users/:id/activate'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/users_controller').default['activate']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/users_controller').default['activate']>>>
    }
  }
  'accounts.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/accounts'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/accounts_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/accounts_controller').default['index']>>>
    }
  }
  'accounts.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/accounts/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/accounts_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/accounts_controller').default['show']>>>
    }
  }
  'ledger_entries.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/ledger-entries'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/ledger_entries_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/ledger_entries_controller').default['index']>>>
    }
  }
  'ledger_entries.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/ledger-entries/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/ledger_entries_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/ledger_entries_controller').default['show']>>>
    }
  }
  'reconciliation.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/reconciliation'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/reconciliation_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/reconciliation_controller').default['index']>>>
    }
  }
  'reconciliation.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/reconciliation/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/reconciliation_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/reconciliation_controller').default['show']>>>
    }
  }
  'reconciliation.upload': {
    methods: ["POST"]
    pattern: '/api/v1/reconciliation/upload'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/reconciliation_controller').default['upload']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/reconciliation_controller').default['upload']>>>
    }
  }
  'reconciliation.match': {
    methods: ["POST"]
    pattern: '/api/v1/reconciliation/match'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/reconciliation_controller').default['match']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/reconciliation_controller').default['match']>>>
    }
  }
  'reconciliation.run_reconciliation': {
    methods: ["POST"]
    pattern: '/api/v1/reconciliation/run'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/reconciliation_controller').default['runReconciliation']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/reconciliation_controller').default['runReconciliation']>>>
    }
  }
  'routing.resolve_provider': {
    methods: ["POST"]
    pattern: '/api/v1/routing/resolve'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/routing_controller').default['resolveProvider']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/routing_controller').default['resolveProvider']>>>
    }
  }
  'monitoring.get_provider_health': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/monitoring/providers'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/monitoring_controller').default['getProviderHealth']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/monitoring_controller').default['getProviderHealth']>>>
    }
  }
  'monitoring.get_queue_stats': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/monitoring/queues'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/monitoring_controller').default['getQueueStats']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/monitoring_controller').default['getQueueStats']>>>
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
  'admin.applications.edit': {
    methods: ["GET","HEAD"]
    pattern: '/admin/applications/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['applicationsEdit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['applicationsEdit']>>>
    }
  }
  'admin.applications.detail': {
    methods: ["GET","HEAD"]
    pattern: '/admin/applications/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['applicationsDetail']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['applicationsDetail']>>>
    }
  }
  'admin.users': {
    methods: ["GET","HEAD"]
    pattern: '/admin/users'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['users']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['users']>>>
    }
  }
  'admin.users.detail': {
    methods: ["GET","HEAD"]
    pattern: '/admin/users/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['usersDetail']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['usersDetail']>>>
    }
  }
  'admin.providers': {
    methods: ["GET","HEAD"]
    pattern: '/admin/providers'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['providers']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['providers']>>>
    }
  }
  'admin.providers.create': {
    methods: ["GET","HEAD"]
    pattern: '/admin/providers/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['providersCreate']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['providersCreate']>>>
    }
  }
  'admin.providers.detail': {
    methods: ["GET","HEAD"]
    pattern: '/admin/providers/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['providersDetail']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['providersDetail']>>>
    }
  }
  'admin.mobile-operators': {
    methods: ["GET","HEAD"]
    pattern: '/admin/mobile-operators'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['mobileOperators']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['mobileOperators']>>>
    }
  }
  'admin.countries': {
    methods: ["GET","HEAD"]
    pattern: '/admin/countries'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['countries']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['countries']>>>
    }
  }
  'admin.currencies': {
    methods: ["GET","HEAD"]
    pattern: '/admin/currencies'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['currencies']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['currencies']>>>
    }
  }
  'admin.transactions': {
    methods: ["GET","HEAD"]
    pattern: '/admin/transactions'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['transactions']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['transactions']>>>
    }
  }
  'admin.webhooks': {
    methods: ["GET","HEAD"]
    pattern: '/admin/webhooks'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['webhooks']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['webhooks']>>>
    }
  }
  'admin.commissions': {
    methods: ["GET","HEAD"]
    pattern: '/admin/commissions'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['commissions']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['commissions']>>>
    }
  }
  'admin.routing': {
    methods: ["GET","HEAD"]
    pattern: '/admin/routing'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['routing']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['routing']>>>
    }
  }
  'admin.logs': {
    methods: ["GET","HEAD"]
    pattern: '/admin/logs'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['logs']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['logs']>>>
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
}
