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
    'countries.index': { paramsTuple?: []; params?: {} }
    'countries.store': { paramsTuple?: []; params?: {} }
    'countries.show': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'countries.update': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'countries.destroy': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'currencies.index': { paramsTuple?: []; params?: {} }
    'currencies.store': { paramsTuple?: []; params?: {} }
    'currencies.show': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'currencies.update': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'currencies.destroy': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'mobile_operators.index': { paramsTuple?: []; params?: {} }
    'mobile_operators.store': { paramsTuple?: []; params?: {} }
    'mobile_operators.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'mobile_operators.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'mobile_operators.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
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
    'admin.applications.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.applications.detail': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.users': { paramsTuple?: []; params?: {} }
    'admin.users.detail': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.providers': { paramsTuple?: []; params?: {} }
    'admin.providers.create': { paramsTuple?: []; params?: {} }
    'admin.providers.detail': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.mobile-operators': { paramsTuple?: []; params?: {} }
    'admin.countries': { paramsTuple?: []; params?: {} }
    'admin.currencies': { paramsTuple?: []; params?: {} }
    'admin.transactions': { paramsTuple?: []; params?: {} }
    'admin.webhooks': { paramsTuple?: []; params?: {} }
    'admin.commissions': { paramsTuple?: []; params?: {} }
    'admin.routing': { paramsTuple?: []; params?: {} }
    'admin.logs': { paramsTuple?: []; params?: {} }
    'admin.settings': { paramsTuple?: []; params?: {} }
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
    'countries.index': { paramsTuple?: []; params?: {} }
    'countries.show': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'currencies.index': { paramsTuple?: []; params?: {} }
    'currencies.show': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'mobile_operators.index': { paramsTuple?: []; params?: {} }
    'mobile_operators.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
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
    'admin.applications.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.applications.detail': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.users': { paramsTuple?: []; params?: {} }
    'admin.users.detail': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.providers': { paramsTuple?: []; params?: {} }
    'admin.providers.create': { paramsTuple?: []; params?: {} }
    'admin.providers.detail': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.mobile-operators': { paramsTuple?: []; params?: {} }
    'admin.countries': { paramsTuple?: []; params?: {} }
    'admin.currencies': { paramsTuple?: []; params?: {} }
    'admin.transactions': { paramsTuple?: []; params?: {} }
    'admin.webhooks': { paramsTuple?: []; params?: {} }
    'admin.commissions': { paramsTuple?: []; params?: {} }
    'admin.routing': { paramsTuple?: []; params?: {} }
    'admin.logs': { paramsTuple?: []; params?: {} }
    'admin.settings': { paramsTuple?: []; params?: {} }
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
    'countries.index': { paramsTuple?: []; params?: {} }
    'countries.show': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'currencies.index': { paramsTuple?: []; params?: {} }
    'currencies.show': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'mobile_operators.index': { paramsTuple?: []; params?: {} }
    'mobile_operators.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
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
    'admin.applications.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.applications.detail': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.users': { paramsTuple?: []; params?: {} }
    'admin.users.detail': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.providers': { paramsTuple?: []; params?: {} }
    'admin.providers.create': { paramsTuple?: []; params?: {} }
    'admin.providers.detail': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.mobile-operators': { paramsTuple?: []; params?: {} }
    'admin.countries': { paramsTuple?: []; params?: {} }
    'admin.currencies': { paramsTuple?: []; params?: {} }
    'admin.transactions': { paramsTuple?: []; params?: {} }
    'admin.webhooks': { paramsTuple?: []; params?: {} }
    'admin.commissions': { paramsTuple?: []; params?: {} }
    'admin.routing': { paramsTuple?: []; params?: {} }
    'admin.logs': { paramsTuple?: []; params?: {} }
    'admin.settings': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'auth.register': { paramsTuple?: []; params?: {} }
    'auth.login': { paramsTuple?: []; params?: {} }
    'auth.refresh': { paramsTuple?: []; params?: {} }
    'auth.logout': { paramsTuple?: []; params?: {} }
    'applications.store': { paramsTuple?: []; params?: {} }
    'api_keys.store': { paramsTuple: [ParamValue]; params: {'application_id': ParamValue} }
    'countries.store': { paramsTuple?: []; params?: {} }
    'currencies.store': { paramsTuple?: []; params?: {} }
    'mobile_operators.store': { paramsTuple?: []; params?: {} }
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
  }
  PUT: {
    'applications.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'countries.update': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'currencies.update': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'mobile_operators.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'providers.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'provider_routes.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'webhooks.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'commissions.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'applications.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'api_keys.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'application_id': ParamValue,'id': ParamValue} }
    'countries.destroy': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'currencies.destroy': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'mobile_operators.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'operator_prefixes.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'mobile_operator_id': ParamValue,'id': ParamValue} }
    'providers.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'provider_routes.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'webhooks.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'commissions.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PATCH: {
    'users.suspend': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.activate': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}