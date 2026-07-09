# Mobile Money Gateway — Plan d'Implémentation

> **Pour Hermes:** Utilise des subagents pour paralléliser backend + frontend.

**Objectif:** Plateforme d'orchestration de paiements Mobile Money — API unique multi-provider avec dashboard admin.

**Stack:** AdonisJS 6 (backend) + React 19 + shadcn/ui + Tailwind CSS 4 (frontend) + Bun + PostgreSQL

---

## Phase 0: Setup — 10 min

### T0.1: Créer le monorepo
- `mkdir -p /home/contabo/mobile-money-gateway`
- `git init`
- Créer `.gitignore`, `README.md`

### T0.2: Initialiser le backend AdonisJS
- `bun create adonisjs@latest backend` (API only, PostgreSQL)
- Configurer `backend/.env` avec DB credentials

### T0.3: Initialiser le frontend React
- `bun create vite frontend --template react-ts`
- Installer Tailwind CSS 4, shadcn/ui, framer-motion

---

## Phase 1: Base de données & Auth — backend

### T1.1: Migrations — tables principales
- users (id, name, email, password, role, status)
- applications (id, owner_id, name, slug, api_key, status)
- countries (id, iso2, name, default_currency_id)
- currencies (id, code, symbol, decimals, status)
- networks (id, country_id, name, status)
- providers (id, name, adapter, status)
- provider_configs (application_id, provider_id, credentials, sandbox, enabled)
- provider_coverages (provider_id, country_id, network_id, currency_id, priority, fee, capabilities)
- transactions (id, application_id, provider_id, country, network, currency, amount, reference, status, metadata)
- webhook_events (id, application_id, provider_id, event, payload, processed_at)
- commissions (configuration par niveau)
- audit_logs (user_id, action, old_value, new_value, ip, date)
- api_keys (application_id, key, permissions, ip_restrictions, expires_at)

### T1.2: Auth system
- Register / Login / Logout
- JWT tokens
- Middleware d'authentification
- Rate limiting

### T1.3: Multi-tenant isolation
- Middleware pour isoler par `application_id` via API key
- Scope automatique des queries

---

## Phase 2: Core API — backend

### T2.1: CRUD Applications
- Créer, lister, modifier, désactiver une application
- Régénération de clés API
- Stats par application

### T2.2: CRUD Countries / Currencies / Networks
- CRUD standard avec seeders

### T2.3: CRUD Providers
- CRUD providers + configuration par application
- Coverage management (pays, réseau, devise, capabilities)

### T2.4: Moteur de routage
- Sélection du meilleur provider selon critères
- Fallback chain
- Calcul des frais

### T2.5: Transactions API
- Initier une transaction (deposit, payout, refund)
- Status check
- Retry / Cancel
- Export CSV/Excel

### T2.6: Webhooks
- Réception webhook provider → format unifié
- Envoi webhook aux applications (HMAC signé)
- Retry queue

### T2.7: Commissions
- Configuration commissions par niveau
- Calcul automatique

### T2.8: Audit & Logs
- Audit trail automatique
- Logs filtering

---

## Phase 3: Frontend — Admin Dashboard

### T3.1: Layout & Navigation
- Sidebar avec navigation
- Dark/light mode
- Responsive

### T3.2: Dashboard page
- Stats cards (apps, users, tx, volume)
- Charts (volume, success rate)
- Provider health indicators

### T3.3: Applications management
- Liste, création, édition, désactivation
- API keys management
- Stats & logs per app

### T3.4: Users management
- Liste, recherche, suspension, rôles

### T3.5: Providers management
- CRUD, test connection, coverage
- Credentials configuration

### T3.6: Networks / Countries / Currencies
- CRUD pages

### T3.7: Routing engine config
- UI de configuration des règles de routage
- Priorités et fallback

### T3.8: Transactions page
- Liste avec filtres avancés
- Détail transaction
- Actions (retry, cancel)
- Export

### T3.9: Webhooks page
- Historique, payload, retry

### T3.10: Commissions page
- Configuration par niveau

### T3.11: Logs & Audit page
- Filtres, recherche, détails

### T3.12: Monitoring page
- Real-time metrics (WebSocket)
- Provider health

### T3.13: Settings page
- Global platform settings

---

## Phase 4: Polish

### T4.1: Animations
- Page transitions (framer-motion)
- Micro-interactions
- Loading skeletons
- Toast notifications

### T4.2: Responsive design
- Mobile-first approach
- Collapsible sidebar

### T4.3: Tests
- Backend: tests unitaires + fonctionnels
- Frontend: tests composants

---

## Ordre d'exécution

1. **Subagent 1 (Backend):** Phase 0 setup → Phase 1 (DB + Auth) → Phase 2 (Core API)
2. **Subagent 2 (Frontend):** Phase 0 setup → Phase 3 (Dashboard) → Phase 4 (Polish)

Les deux agents travaillent en parallèle. Commit par feature.
