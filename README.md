# Mobile Money Gateway (MMG)

Plateforme unifiée de paiement mobile money — agrège plusieurs providers (Shwary, Orange Money, MTN, Airtel…) derrière une API unique et un dashboard d'administration.

![Architecture](docs/architecture.svg)

## Stack technique

| Couche | Technologie |
|---|---|
| Backend | [AdonisJS 7](https://adonisjs.com) (TypeScript, ESM) |
| Frontend admin | [Inertia.js](https://inertiajs.com) + [React 19](https://react.dev) + [shadcn/ui](https://ui.shadcn.com) |
| Base de données | PostgreSQL |
| Package manager | Bun |
| Providers | Classes TypeScript extensibles (Open/Closed) |

## Architecture

```
Clients (API REST / SDK)
    │
    ▼
┌─────────────────────────────┐
│     API Gateway (AdonisJS)   │
│  Auth (API Keys / JWT)       │
│  Rate Limiting               │
└──────────┬──────────────────┘
           │
     ┌─────▼──────┐
     │  Routing   │  ← Résout MSISDN → Pays → Opérateur → Provider
     └─────┬──────┘
           │
    ┌──────▼───────┐
    │  Transaction  │  ← Cycle de vie : pending → processing → completed/failed
    └──────┬───────┘
           │
    ┌──────▼──────────────────────────────┐
    │         Provider System             │
    │  ┌────────┐ ┌────────┐ ┌────────┐   │
    │  │ Shwary │ │ Orange │ │  MTN   │…  │
    │  └────────┘ └────────┘ └────────┘   │
    │  Code-first · Auto-discovery · Sync │
    └─────────────────────────────────────┘
           │
    ┌──────▼───────┐
    │   Webhooks   │  ← Callbacks providers → mise à jour statuts
    └──────────────┘
```

## Fonctionnalités

### Core
- **API REST** versionnée (`/api/v1`) avec authentification par clés API
- **Routage intelligent** : numéro MSISDN → pays → opérateur mobile → provider (avec fallback)
- **Transactions** : collection (débit) et payout (crédit), avec statuts normalisés
- **Webhooks** : notifications de statut en temps réel, signatures vérifiées
- **Idempotence** : clé d'idempotence pour éviter les doubles paiements

### Système de Providers (extensible)
- **Code-first** : un provider = une classe héritant de `BasePaymentProvider`
- **Auto-discovery** : les classes dans `app/providers/payment/` sont détectées au démarrage
- **Synchro DB** : métadonnées (label, description, icône) synchronisées automatiquement
- **Dashboard** : activation/désactivation, configuration, pays supportés, opérateurs liés
- **Contrat standardisé** : `createPayment`, `getTransaction`, `listTransactions`, `verifyWebhook`, `handleWebhook`, `testConnection`, `validateConfiguration`
- **Statuts normalisés** : PENDING → PROCESSING → COMPLETED / FAILED / CANCELLED
- **Providers actuels** : Shwary (RDC, Kenya, Ouganda)

### Administration
- **Dashboard** multi-application avec statistiques (volume, taux de succès)
- **Gestion des applications** : nom, slug, clés API
- **Pays** : ajout/suppression par code ISO
- **Opérateurs mobiles** : création avec préfixes, liaison aux pays
- **Providers** : configuration, liaison pays/opérateurs, visualisation des routes
- **Utilisateurs** : rôles (admin, super_admin), suspension
- **Logs d'audit** : traçabilité complète des actions
- **Commissions** : configuration par pays/opérateur/provider
- **Réconciliation** : rapprochement des transactions

## Structure du projet

```
mobgateway/
├── app/
│   ├── controllers/        # Contrôleurs HTTP (API + Inertia)
│   ├── models/             # Modèles Lucid ORM
│   ├── providers/          # Système de providers de paiement
│   │   ├── base_payment_provider.ts
│   │   ├── provider_registry.ts
│   │   └── payment/shwary/
│   ├── services/           # Logique métier
│   ├── transformers/       # Transformateurs de données (API/Inertia)
│   ├── validators/         # Validation VineJS
│   └── middleware/         # Auth, tenant, admin, Inertia
├── database/
│   ├── migrations/         # Migrations PostgreSQL
│   └── schema.ts           # Schéma auto-généré
├── inertia/
│   ├── pages/admin/        # Pages du dashboard
│   ├── components/         # Composants React partagés
│   ├── layouts/            # Layouts admin/default
│   └── context/            # Stores Zustand
├── start/
│   ├── routes.ts           # Définition des routes
│   ├── kernel.ts           # Middleware global
│   ├── env.ts              # Validation des variables d'environnement
│   └── provider_sync.ts    # Hook de synchro providers au démarrage
├── config/                 # Configuration AdonisJS
└── providers/              # Service providers AdonisJS
```

## Modèle de données

```
Application (1) ──< (N) Country
Application (1) ──< (N) User
Application (1) ──< (N) ApiKey
Application (1) ──< (N) Transaction
Application (1) ──< (N) Webhook

Country (1) ──< (N) MobileOperator
Country (N) ──< (M) Provider … via provider_countries

MobileOperator (1) ──< (N) OperatorPrefix
MobileOperator (N) ──< (M) Provider … via provider_routes

Provider (1) ──< (N) ProviderRoute
Provider (1) ──< (N) Transaction
Provider (1) ──< (N) Commission

Transaction (1) ──< (N) TransactionEvent
Transaction (1) ──< (N) LedgerEntry
```

## Démarrage

```bash
# Prérequis : Node 22+, PostgreSQL, Bun
bun install

# Copier et configurer les variables d'environnement
cp .env.example .env
# Éditer .env (DB_HOST, DB_PORT, DB_USER, DB_DATABASE, etc.)

# Lancer les migrations
node ace migration:run

# Démarrer le serveur de développement
node ace serve

# Optionnel : variables Shwary
SHWARY_BASE_URL=https://api.shwary.com/api/v1
SHWARY_ID_MARCHAND=votre-merchant-id
SHWARY_SECRET=votre-merchant-key
SHWARY_IS_SANDBOX=true
```

## Ajouter un nouveau provider

1. Créer une classe dans `app/providers/payment/<nom>/<nom>_provider.ts`
2. Hériter de `BasePaymentProvider`
3. Implémenter les 9 méthodes abstraites
4. Redémarrer le serveur → le provider est auto-détecté et synchronisé en base

```ts
export default class OrangeProvider extends BasePaymentProvider {
  readonly provider = 'orange-money'
  readonly label = 'Orange Money'
  readonly description = 'Orange Money mobile payments'
  readonly icon = '🟠'

  async initialize(config: ProviderConfig): Promise<void> { /* … */ }
  async createPayment(req: PaymentRequest): Promise<PaymentTransaction> { /* … */ }
  async getTransaction(id: string): Promise<PaymentTransaction> { /* … */ }
  async listTransactions(opts?: TransactionFilter): Promise<PaymentTransaction[]> { /* … */ }
  async verifyWebhook(req: WebhookRequest): Promise<boolean> { /* … */ }
  async handleWebhook(req: WebhookRequest): Promise<PaymentTransaction> { /* … */ }
  async testConnection(): Promise<boolean> { /* … */ }
  async validateConfiguration(config: ProviderConfig): Promise<void> { /* … */ }
}
```

## Licence

MIT
