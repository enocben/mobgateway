import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'home': { paramsTuple?: []; params?: {} }
    'auth.register': { paramsTuple?: []; params?: {} }
    'auth.login': { paramsTuple?: []; params?: {} }
    'auth.refresh': { paramsTuple?: []; params?: {} }
    'auth.me': { paramsTuple?: []; params?: {} }
    'auth.logout': { paramsTuple?: []; params?: {} }
    'dashboard.get_stats': { paramsTuple?: []; params?: {} }
    'applications.index': { paramsTuple?: []; params?: {} }
    'applications.store': { paramsTuple?: []; params?: {} }
    'applications.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'applications.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'applications.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'applications.stats': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'api_keys.index': { paramsTuple: [ParamValue]; params: {'application_id': ParamValue} }
    'api_keys.store': { paramsTuple: [ParamValue]; params: {'application_id': ParamValue} }
    'api_keys.show': { paramsTuple: [ParamValue,ParamValue]; params: {'application_id': ParamValue,'id': ParamValue} }
    'api_keys.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'application_id': ParamValue,'id': ParamValue} }
    'operator_prefixes.index': { paramsTuple: [ParamValue]; params: {'mobile_operator_id': ParamValue} }
    'operator_prefixes.store': { paramsTuple: [ParamValue]; params: {'mobile_operator_id': ParamValue} }
    'operator_prefixes.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'mobile_operator_id': ParamValue,'id': ParamValue} }
    'providers.index': { paramsTuple?: []; params?: {} }
    'providers.store': { paramsTuple?: []; params?: {} }
    'providers.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'providers.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'providers.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'providers.test_connection': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'providers.stats': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'provider_routes.index': { paramsTuple?: []; params?: {} }
    'provider_routes.store': { paramsTuple?: []; params?: {} }
    'provider_routes.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'provider_routes.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'provider_routes.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'transactions.index': { paramsTuple?: []; params?: {} }
    'transactions.store': { paramsTuple?: []; params?: {} }
    'transactions.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'transactions.retry': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'transactions.cancel': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'transactions.export_csv': { paramsTuple?: []; params?: {} }
    'webhooks.index': { paramsTuple?: []; params?: {} }
    'webhooks.store': { paramsTuple?: []; params?: {} }
    'webhooks.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'webhooks.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'webhooks.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'webhooks.deliveries': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'webhooks.retry_delivery': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'delivery_id': ParamValue} }
    'commissions.index': { paramsTuple?: []; params?: {} }
    'commissions.store': { paramsTuple?: []; params?: {} }
    'commissions.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'commissions.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'commissions.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'audit_logs.index': { paramsTuple?: []; params?: {} }
    'audit_logs.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.index': { paramsTuple?: []; params?: {} }
    'users.store': { paramsTuple?: []; params?: {} }
    'users.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.suspend': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.activate': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'accounts.index': { paramsTuple?: []; params?: {} }
    'accounts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'ledger_entries.index': { paramsTuple?: []; params?: {} }
    'ledger_entries.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'reconciliation.index': { paramsTuple?: []; params?: {} }
    'reconciliation.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'reconciliation.upload': { paramsTuple?: []; params?: {} }
    'reconciliation.match': { paramsTuple?: []; params?: {} }
    'reconciliation.run_reconciliation': { paramsTuple?: []; params?: {} }
    'routing.resolve_provider': { paramsTuple?: []; params?: {} }
    'monitoring.get_provider_health': { paramsTuple?: []; params?: {} }
    'monitoring.get_queue_stats': { paramsTuple?: []; params?: {} }
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
    'admin.users': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.users.detail': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'userId': ParamValue} }
    'admin.providers': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.providers.create': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.providers.detail': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'providerId': ParamValue} }
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
    'auth.me': { paramsTuple?: []; params?: {} }
    'dashboard.get_stats': { paramsTuple?: []; params?: {} }
    'applications.index': { paramsTuple?: []; params?: {} }
    'applications.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'applications.stats': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'api_keys.index': { paramsTuple: [ParamValue]; params: {'application_id': ParamValue} }
    'api_keys.show': { paramsTuple: [ParamValue,ParamValue]; params: {'application_id': ParamValue,'id': ParamValue} }
    'operator_prefixes.index': { paramsTuple: [ParamValue]; params: {'mobile_operator_id': ParamValue} }
    'providers.index': { paramsTuple?: []; params?: {} }
    'providers.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'providers.stats': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'provider_routes.index': { paramsTuple?: []; params?: {} }
    'provider_routes.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'transactions.index': { paramsTuple?: []; params?: {} }
    'transactions.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'transactions.export_csv': { paramsTuple?: []; params?: {} }
    'webhooks.index': { paramsTuple?: []; params?: {} }
    'webhooks.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'webhooks.deliveries': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'commissions.index': { paramsTuple?: []; params?: {} }
    'commissions.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'audit_logs.index': { paramsTuple?: []; params?: {} }
    'audit_logs.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.index': { paramsTuple?: []; params?: {} }
    'users.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'accounts.index': { paramsTuple?: []; params?: {} }
    'accounts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'ledger_entries.index': { paramsTuple?: []; params?: {} }
    'ledger_entries.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'reconciliation.index': { paramsTuple?: []; params?: {} }
    'reconciliation.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'monitoring.get_provider_health': { paramsTuple?: []; params?: {} }
    'monitoring.get_queue_stats': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'admin': { paramsTuple?: []; params?: {} }
    'admin.dashboard': { paramsTuple?: []; params?: {} }
    'admin.applications': { paramsTuple?: []; params?: {} }
    'admin.applications.create': { paramsTuple?: []; params?: {} }
    'admin.applications.detail': { paramsTuple: [ParamValue]; params: {'appId': ParamValue} }
    'admin.settings': { paramsTuple?: []; params?: {} }
    'admin.applications.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.users': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.users.detail': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'userId': ParamValue} }
    'admin.providers': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.providers.create': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
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
    'auth.me': { paramsTuple?: []; params?: {} }
    'dashboard.get_stats': { paramsTuple?: []; params?: {} }
    'applications.index': { paramsTuple?: []; params?: {} }
    'applications.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'applications.stats': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'api_keys.index': { paramsTuple: [ParamValue]; params: {'application_id': ParamValue} }
    'api_keys.show': { paramsTuple: [ParamValue,ParamValue]; params: {'application_id': ParamValue,'id': ParamValue} }
    'operator_prefixes.index': { paramsTuple: [ParamValue]; params: {'mobile_operator_id': ParamValue} }
    'providers.index': { paramsTuple?: []; params?: {} }
    'providers.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'providers.stats': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'provider_routes.index': { paramsTuple?: []; params?: {} }
    'provider_routes.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'transactions.index': { paramsTuple?: []; params?: {} }
    'transactions.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'transactions.export_csv': { paramsTuple?: []; params?: {} }
    'webhooks.index': { paramsTuple?: []; params?: {} }
    'webhooks.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'webhooks.deliveries': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'commissions.index': { paramsTuple?: []; params?: {} }
    'commissions.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'audit_logs.index': { paramsTuple?: []; params?: {} }
    'audit_logs.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.index': { paramsTuple?: []; params?: {} }
    'users.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'accounts.index': { paramsTuple?: []; params?: {} }
    'accounts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'ledger_entries.index': { paramsTuple?: []; params?: {} }
    'ledger_entries.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'reconciliation.index': { paramsTuple?: []; params?: {} }
    'reconciliation.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'monitoring.get_provider_health': { paramsTuple?: []; params?: {} }
    'monitoring.get_queue_stats': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'admin': { paramsTuple?: []; params?: {} }
    'admin.dashboard': { paramsTuple?: []; params?: {} }
    'admin.applications': { paramsTuple?: []; params?: {} }
    'admin.applications.create': { paramsTuple?: []; params?: {} }
    'admin.applications.detail': { paramsTuple: [ParamValue]; params: {'appId': ParamValue} }
    'admin.settings': { paramsTuple?: []; params?: {} }
    'admin.applications.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.users': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.users.detail': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'userId': ParamValue} }
    'admin.providers': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.providers.create': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
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
    'auth.logout': { paramsTuple?: []; params?: {} }
    'applications.store': { paramsTuple?: []; params?: {} }
    'api_keys.store': { paramsTuple: [ParamValue]; params: {'application_id': ParamValue} }
    'operator_prefixes.store': { paramsTuple: [ParamValue]; params: {'mobile_operator_id': ParamValue} }
    'providers.store': { paramsTuple?: []; params?: {} }
    'providers.test_connection': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'provider_routes.store': { paramsTuple?: []; params?: {} }
    'transactions.store': { paramsTuple?: []; params?: {} }
    'transactions.retry': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'transactions.cancel': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'webhooks.store': { paramsTuple?: []; params?: {} }
    'webhooks.retry_delivery': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'delivery_id': ParamValue} }
    'commissions.store': { paramsTuple?: []; params?: {} }
    'users.store': { paramsTuple?: []; params?: {} }
    'reconciliation.upload': { paramsTuple?: []; params?: {} }
    'reconciliation.match': { paramsTuple?: []; params?: {} }
    'reconciliation.run_reconciliation': { paramsTuple?: []; params?: {} }
    'routing.resolve_provider': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'admin.mobile-operators.store': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.countries.create': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'iso2': ParamValue} }
  }
  PUT: {
    'applications.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'providers.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'provider_routes.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'webhooks.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'commissions.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.mobile-operators.update': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'operatorId': ParamValue} }
  }
  DELETE: {
    'applications.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'api_keys.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'application_id': ParamValue,'id': ParamValue} }
    'operator_prefixes.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'mobile_operator_id': ParamValue,'id': ParamValue} }
    'providers.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'provider_routes.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'webhooks.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'commissions.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.mobile-operators.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'operatorId': ParamValue} }
    'admin.countries.delete': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'countryId': ParamValue} }
  }
  PATCH: {
    'users.suspend': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.activate': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}