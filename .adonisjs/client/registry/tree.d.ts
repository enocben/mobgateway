/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  home: typeof routes['home']
  auth: {
    register: typeof routes['auth.register']
    login: typeof routes['auth.login']
    refresh: typeof routes['auth.refresh']
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
    app: {
      settings: typeof routes['admin.app.settings'] & {
        update: typeof routes['admin.app.settings.update']
        apiKey: {
          generate: typeof routes['admin.app.settings.api-key.generate']
          destroy: typeof routes['admin.app.settings.api-key.destroy']
        }
      }
    }
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
