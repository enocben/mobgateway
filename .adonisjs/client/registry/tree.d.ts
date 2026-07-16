/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  home: typeof routes['home']
  auth: {
    register: typeof routes['auth.register']
    login: typeof routes['auth.login']
    refresh: typeof routes['auth.refresh']
    me: typeof routes['auth.me']
    logout: typeof routes['auth.logout']
  }
  dashboard: {
    getStats: typeof routes['dashboard.get_stats']
  }
  applications: {
    index: typeof routes['applications.index']
    store: typeof routes['applications.store']
    show: typeof routes['applications.show']
    update: typeof routes['applications.update']
    destroy: typeof routes['applications.destroy']
    stats: typeof routes['applications.stats']
  }
  apiKeys: {
    index: typeof routes['api_keys.index']
    store: typeof routes['api_keys.store']
    show: typeof routes['api_keys.show']
    destroy: typeof routes['api_keys.destroy']
  }
  operatorPrefixes: {
    index: typeof routes['operator_prefixes.index']
    store: typeof routes['operator_prefixes.store']
    destroy: typeof routes['operator_prefixes.destroy']
  }
  transactions: {
    index: typeof routes['transactions.index']
    store: typeof routes['transactions.store']
    show: typeof routes['transactions.show']
    retry: typeof routes['transactions.retry']
    cancel: typeof routes['transactions.cancel']
    exportCsv: typeof routes['transactions.export_csv']
  }
  webhooks: {
    index: typeof routes['webhooks.index']
    store: typeof routes['webhooks.store']
    show: typeof routes['webhooks.show']
    update: typeof routes['webhooks.update']
    destroy: typeof routes['webhooks.destroy']
    deliveries: typeof routes['webhooks.deliveries']
    retryDelivery: typeof routes['webhooks.retry_delivery']
  }
  commissions: {
    index: typeof routes['commissions.index']
    store: typeof routes['commissions.store']
    show: typeof routes['commissions.show']
    update: typeof routes['commissions.update']
    destroy: typeof routes['commissions.destroy']
  }
  auditLogs: {
    index: typeof routes['audit_logs.index']
    show: typeof routes['audit_logs.show']
  }
  providers: {
    index: typeof routes['providers.index']
    show: typeof routes['providers.show']
    update: typeof routes['providers.update']
    testConnection: typeof routes['providers.test_connection']
    stats: typeof routes['providers.stats']
  }
  users: {
    index: typeof routes['users.index']
    store: typeof routes['users.store']
    show: typeof routes['users.show']
    update: typeof routes['users.update']
    destroy: typeof routes['users.destroy']
    suspend: typeof routes['users.suspend']
    activate: typeof routes['users.activate']
  }
  accounts: {
    index: typeof routes['accounts.index']
    show: typeof routes['accounts.show']
  }
  ledgerEntries: {
    index: typeof routes['ledger_entries.index']
    show: typeof routes['ledger_entries.show']
  }
  reconciliation: {
    index: typeof routes['reconciliation.index']
    show: typeof routes['reconciliation.show']
    upload: typeof routes['reconciliation.upload']
    match: typeof routes['reconciliation.match']
    runReconciliation: typeof routes['reconciliation.run_reconciliation']
  }
  routing: {
    resolveProvider: typeof routes['routing.resolve_provider']
  }
  monitoring: {
    getProviderHealth: typeof routes['monitoring.get_provider_health']
    getQueueStats: typeof routes['monitoring.get_queue_stats']
  }
  newAccount: {
    create: typeof routes['new_account.create']
    store: typeof routes['new_account.store']
  }
  session: {
    create: typeof routes['session.create']
    store: typeof routes['session.store']
    destroy: typeof routes['session.destroy']
  }
  admin: typeof routes['admin'] & {
    dashboard: typeof routes['admin.dashboard']
    applications: typeof routes['admin.applications'] & {
      create: typeof routes['admin.applications.create']
      detail: typeof routes['admin.applications.detail']
      edit: typeof routes['admin.applications.edit']
    }
    settings: typeof routes['admin.settings']
    users: typeof routes['admin.users'] & {
      detail: typeof routes['admin.users.detail']
    }
    providers: typeof routes['admin.providers'] & {
      detail: typeof routes['admin.providers.detail']
      countries: {
        store: typeof routes['admin.providers.countries.store']
        destroy: typeof routes['admin.providers.countries.destroy']
      }
      routes: {
        store: typeof routes['admin.providers.routes.store']
        destroy: typeof routes['admin.providers.routes.destroy']
      }
    }
    mobileOperators: typeof routes['admin.mobile-operators'] & {
      store: typeof routes['admin.mobile-operators.store']
      update: typeof routes['admin.mobile-operators.update']
      destroy: typeof routes['admin.mobile-operators.destroy']
    }
    countries: typeof routes['admin.countries'] & {
      create: typeof routes['admin.countries.create']
      delete: typeof routes['admin.countries.delete']
    }
    transactions: typeof routes['admin.transactions']
    webhooks: typeof routes['admin.webhooks']
    commissions: typeof routes['admin.commissions']
    routing: typeof routes['admin.routing']
    logs: typeof routes['admin.logs']
  }
}
