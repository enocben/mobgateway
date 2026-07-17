import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'home': { paramsTuple?: []; params?: {} }
    'auth.register': { paramsTuple?: []; params?: {} }
    'auth.login': { paramsTuple?: []; params?: {} }
    'auth.refresh': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'admin': { paramsTuple?: []; params?: {} }
    'admin.dashboard': { paramsTuple?: []; params?: {} }
    'admin.applications': { paramsTuple?: []; params?: {} }
    'admin.applications.create': { paramsTuple?: []; params?: {} }
    'admin.applications.detail': { paramsTuple: [ParamValue]; params: {'appId': ParamValue} }
    'admin.settings': { paramsTuple?: []; params?: {} }
    'admin.applications.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.app.settings': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.app.settings.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.app.settings.api-key.generate': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.app.settings.api-key.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'keyId': ParamValue} }
    'admin.users': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.users.detail': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'userId': ParamValue} }
    'admin.providers': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.providers.detail': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'providerId': ParamValue} }
    'admin.providers.countries.store': { paramsTuple: [ParamValue,ParamValue,ParamValue]; params: {'id': ParamValue,'providerId': ParamValue,'countryId': ParamValue} }
    'admin.providers.countries.destroy': { paramsTuple: [ParamValue,ParamValue,ParamValue]; params: {'id': ParamValue,'providerId': ParamValue,'countryId': ParamValue} }
    'admin.providers.routes.store': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'providerId': ParamValue} }
    'admin.providers.routes.destroy': { paramsTuple: [ParamValue,ParamValue,ParamValue]; params: {'id': ParamValue,'providerId': ParamValue,'routeId': ParamValue} }
    'admin.mobile-operators': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.mobile-operators.store': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.mobile-operators.update': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'operatorId': ParamValue} }
    'admin.mobile-operators.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'operatorId': ParamValue} }
    'admin.countries': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.countries.create': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'iso2': ParamValue} }
    'admin.countries.delete': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'countryId': ParamValue} }
    'admin.transactions': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.webhooks': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.commissions': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.routing': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.logs': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'admin': { paramsTuple?: []; params?: {} }
    'admin.dashboard': { paramsTuple?: []; params?: {} }
    'admin.applications': { paramsTuple?: []; params?: {} }
    'admin.applications.create': { paramsTuple?: []; params?: {} }
    'admin.applications.detail': { paramsTuple: [ParamValue]; params: {'appId': ParamValue} }
    'admin.settings': { paramsTuple?: []; params?: {} }
    'admin.applications.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.app.settings': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.users': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.users.detail': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'userId': ParamValue} }
    'admin.providers': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.providers.detail': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'providerId': ParamValue} }
    'admin.mobile-operators': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.countries': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.transactions': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.webhooks': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.commissions': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.routing': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.logs': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'admin': { paramsTuple?: []; params?: {} }
    'admin.dashboard': { paramsTuple?: []; params?: {} }
    'admin.applications': { paramsTuple?: []; params?: {} }
    'admin.applications.create': { paramsTuple?: []; params?: {} }
    'admin.applications.detail': { paramsTuple: [ParamValue]; params: {'appId': ParamValue} }
    'admin.settings': { paramsTuple?: []; params?: {} }
    'admin.applications.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.app.settings': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.users': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.users.detail': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'userId': ParamValue} }
    'admin.providers': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.providers.detail': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'providerId': ParamValue} }
    'admin.mobile-operators': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.countries': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.transactions': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.webhooks': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.commissions': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.routing': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.logs': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'auth.register': { paramsTuple?: []; params?: {} }
    'auth.login': { paramsTuple?: []; params?: {} }
    'auth.refresh': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'admin.app.settings.api-key.generate': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.providers.countries.store': { paramsTuple: [ParamValue,ParamValue,ParamValue]; params: {'id': ParamValue,'providerId': ParamValue,'countryId': ParamValue} }
    'admin.providers.routes.store': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'providerId': ParamValue} }
    'admin.mobile-operators.store': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.countries.create': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'iso2': ParamValue} }
  }
  PUT: {
    'admin.app.settings.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.mobile-operators.update': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'operatorId': ParamValue} }
  }
  DELETE: {
    'admin.app.settings.api-key.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'keyId': ParamValue} }
    'admin.providers.countries.destroy': { paramsTuple: [ParamValue,ParamValue,ParamValue]; params: {'id': ParamValue,'providerId': ParamValue,'countryId': ParamValue} }
    'admin.providers.routes.destroy': { paramsTuple: [ParamValue,ParamValue,ParamValue]; params: {'id': ParamValue,'providerId': ParamValue,'routeId': ParamValue} }
    'admin.mobile-operators.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'operatorId': ParamValue} }
    'admin.countries.delete': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'countryId': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}