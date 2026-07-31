# Payment Flow — Déblocage complet

> **For Hermes:** Implémenter ce plan tâche par tâche, dans l'ordre. Chaque tâche est indépendante et produit un commit.

**Goal:** Rendre le flux de paiement fonctionnel de bout en bout : un marchand envoie un MSISDN + montant → le système route vers Shwary → Shwary initie le paiement → le statut est persisté en base.

**Architecture:** Controller REST (`PaymentController`) → `PaymentService` (orchestration) → `RoutingService` (résolution MSISDN) → `ProviderRegistry.getInstance()` → `ShwaryProvider.createPayment()` → `Transaction` (persistance).

**Tech Stack:** AdonisJS 7, TypeScript, PostgreSQL, Lucid ORM, VineJS validators, ProviderRegistry existant.

---

## Prérequis avant exécution

- [ ] Remplir `SHWARY_ID_MARCHAND` dans `.env`
- [ ] Ajouter `SHWARY_PHONE_NUMBER` et `SHWARY_PASSWORD` dans `.env`
- [ ] Lier Shwary aux pays/opérateurs dans le dashboard admin (RDC: +243, Kenya: +254, Ouganda: +256)

---

## Tâches

### Task 1: Créer le validateur de paiement

**Objective:** Valider les requêtes entrantes de création de paiement.

**Files:**
- Create: `app/validators/payment.ts`

**Code complet:**

```typescript
import vine from '@vinejs/vine'

/**
 * Validation pour initier un paiement (collection).
 */
export const createPaymentValidator = vine.compile(
  vine.object({
    msisdn: vine.string().trim().minLength(8).maxLength(20),
    amount: vine.number().min(1).max(999999999),
    currency: vine.string().trim().fixedLength(3),
    reference: vine.string().trim().minLength(1).maxLength(255).optional(),
    metadata: vine.object({}).allowUnknownProperties().optional(),
  })
)
```

**Verification:**
```bash
cd /home/contabo/mobgateway && PATH="$HOME/.bun/bin:$PATH" npx tsc --noEmit --pretty 2>&1 | head -5
```
Expected: No new errors related to `payment.ts`.

**Commit:**
```bash
git add app/validators/payment.ts
git commit -m "feat: add payment request validator"
```

---

### Task 2: Créer le PaymentService (orchestration)

**Objective:** Service qui orchestre le flux complet : résolution MSISDN → provider call → persistence.

**Files:**
- Create: `app/services/payment_service.ts`

**Code complet:**

```typescript
import { inject } from '@adonisjs/core'
import { randomUUID } from 'node:crypto'
import Transaction from '#models/transaction'
import TransactionEvent from '#models/transaction_event'
import RoutingService from '#services/routing_service'
import { providerRegistry } from '#pro/provider_registry'
import type { PaymentRequest } from '#pro/base_payment_provider'
import { PaymentStatus } from '#pro/base_payment_provider'

@inject()
export class PaymentService {
  constructor(protected routing: RoutingService) {}

  /**
   * Initier un paiement (collection) de bout en bout.
   *
   * Flux :
   * 1. Résoudre MSISDN → pays → opérateur → provider route
   * 2. Vérifier qu'un provider est trouvé
   * 3. Créer la transaction en base (status = pending)
   * 4. Appeler le provider.createPayment()
   * 5. Mettre à jour la transaction avec la réponse du provider
   */
  async initiatePayment(params: {
    applicationId: string
    msisdn: string
    amount: number
    currency: string
    reference?: string
    metadata?: Record<string, unknown>
  }) {
    // Step 1: Résoudre la route
    const route = await this.routing.resolveMsisdn(params.msisdn)

    if (!route.provider || !route.providerRoute) {
      throw new PaymentError(
        'NO_ROUTE',
        `No active provider found for MSISDN ${params.msisdn} (country: ${route.countryCode || 'unknown'})`
      )
    }

    const provider = route.provider

    // Step 2: Créer la transaction en base
    const idempotencyKey = randomUUID()
    const reference = params.reference ?? `TXN-${randomUUID().slice(0, 12).toUpperCase()}`

    const transaction = await Transaction.create({
      applicationId: params.applicationId,
      mobileOperatorId: route.mobileOperatorId,
      providerId: provider.id,
      providerRouteId: route.providerRoute.id,
      idempotencyKey,
      txType: 'collection',
      msisdn: params.msisdn,
      reference,
      amount: params.amount,
      currency: params.currency,
      fxRate: 1.0,
      status: 'pending',
      metadata: params.metadata ?? {},
    })

    await TransactionEvent.create({
      transactionId: transaction.id,
      fromStatus: null,
      toStatus: 'pending',
      payload: { action: 'initiate', routing: { countryCode: route.countryCode } },
    })

    // Step 3: Obtenir une instance du provider et initier le paiement
    try {
      const providerConfig = {
        sandbox: true, // TODO: lire depuis la config provider ou env
        values: (provider.config as Record<string, unknown>) ?? {},
      }

      const instance = await providerRegistry.getInstance(provider.code, providerConfig)
      if (!instance) {
        throw new PaymentError('PROVIDER_NOT_FOUND', `Provider ${provider.code} not registered`)
      }

      const paymentRequest: PaymentRequest = {
        amount: params.amount,
        currency: params.currency,
        phoneNumber: params.msisdn,
        reference,
        callbackUrl: `${process.env.APP_URL}/api/v1/webhooks/shwary`,
        metadata: params.metadata,
      }

      const result = await instance.createPayment(paymentRequest)

      // Step 4: Mettre à jour la transaction avec la réponse
      transaction.providerRef = result.providerReference ?? result.id
      transaction.status = this.mapStatus(result.status)
      await transaction.save()

      await TransactionEvent.create({
        transactionId: transaction.id,
        fromStatus: 'pending',
        toStatus: transaction.status,
        payload: { providerResponse: result },
      })

      await transaction.load('events')
      await transaction.load('provider')
      return transaction
    } catch (err) {
      // Marquer la transaction comme failed
      transaction.status = 'failed'
      transaction.errorMessage = err instanceof Error ? err.message : String(err)
      await transaction.save()

      await TransactionEvent.create({
        transactionId: transaction.id,
        fromStatus: 'pending',
        toStatus: 'failed',
        payload: { error: transaction.errorMessage },
      })

      throw err
    }
  }

  private mapStatus(status: PaymentStatus): string {
    const mapping: Record<string, string> = {
      [PaymentStatus.PENDING]: 'pending',
      [PaymentStatus.PROCESSING]: 'processing',
      [PaymentStatus.COMPLETED]: 'completed',
      [PaymentStatus.FAILED]: 'failed',
      [PaymentStatus.CANCELLED]: 'cancelled',
    }
    return mapping[status] ?? 'pending'
  }
}

export class PaymentError extends Error {
  constructor(
    public readonly code: string,
    message: string
  ) {
    super(message)
    this.name = 'PaymentError'
  }
}
```

**Verification:**
```bash
cd /home/contabo/mobgateway && PATH="$HOME/.bun/bin:$PATH" npx tsc --noEmit --pretty 2>&1 | head -10
```
Expected: No new errors related to `payment_service.ts`.

**Commit:**
```bash
git add app/services/payment_service.ts
git commit -m "feat: add PaymentService for end-to-end payment orchestration"
```

---

### Task 3: Créer le PaymentController

**Objective:** Endpoint REST pour initier un paiement et consulter une transaction.

**Files:**
- Create: `app/controllers/payment_controller.ts`

**Code complet:**

```typescript
import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { PaymentService } from '#services/payment_service'
import { createPaymentValidator } from '#validators/payment'
import Transaction from '#models/transaction'
import { PaymentError } from '#services/payment_service'

@inject()
export default class PaymentController {
  constructor(protected paymentService: PaymentService) {}

  /**
   * POST /api/v1/merchants/payment
   *
   * Headers requis (via middleware tenant) :
   *   x-application-id  — identifiant de l'application
   */
  async create({ request, response }: HttpContext) {
    const appId = request.header('x-application-id')
    if (!appId) {
      return response.status(401).json({
        message: 'Missing x-application-id header',
      })
    }

    const [error, data] = await createPaymentValidator.tryValidate(request.body())

    if (error) {
      return response.status(422).json({
        message: 'Validation failed',
        errors: error.messages,
      })
    }

    try {
      const transaction = await this.paymentService.initiatePayment({
        applicationId: appId,
        msisdn: data.msisdn,
        amount: data.amount,
        currency: data.currency,
        reference: data.reference,
        metadata: data.metadata,
      })

      return response.status(201).json(transaction)
    } catch (err) {
      if (err instanceof PaymentError) {
        const statusMap: Record<string, number> = {
          NO_ROUTE: 422,
          PROVIDER_NOT_FOUND: 500,
        }
        return response.status(statusMap[err.code] ?? 500).json({
          message: err.message,
          code: err.code,
        })
      }

      // Provider error — la transaction est déjà en base avec status=failed
      return response.status(502).json({
        message: err instanceof Error ? err.message : 'Payment failed',
        code: 'PROVIDER_ERROR',
      })
    }
  }

  /**
   * GET /api/v1/merchants/transactions/:id
   */
  async show({ params, response }: HttpContext) {
    const transaction = await Transaction.query()
      .where('id', params.id)
      .preload('provider')
      .preload('events')
      .first()

    if (!transaction) {
      return response.status(404).json({ message: 'Transaction not found' })
    }

    return response.status(200).json(transaction)
  }

  /**
   * GET /api/v1/merchants/transactions
   */
  async index({ request, response }: HttpContext) {
    const appId = request.header('x-application-id')
    if (!appId) {
      return response.status(401).json({
        message: 'Missing x-application-id header',
      })
    }

    const page = request.input('page', 1)
    const limit = request.input('limit', 20)

    const transactions = await Transaction.query()
      .where('application_id', appId)
      .preload('provider')
      .preload('events')
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    return response.status(200).json(transactions)
  }
}
```

**Verification:**
```bash
cd /home/contabo/mobgateway && PATH="$HOME/.bun/bin:$PATH" npx tsc --noEmit --pretty 2>&1 | head -10
```
Expected: No new errors.

**Commit:**
```bash
git add app/controllers/payment_controller.ts
git commit -m "feat: add PaymentController with create/show/index endpoints"
```

---

### Task 4: Ajouter les routes API marchandes

**Objective:** Déclarer les routes pour le controller de paiement.

**Files:**
- Modify: `start/routes.ts`

**Modification:** Dans le groupe API non-authentifié (avant le `.use(middleware.auth())`), ajouter :

```typescript
// Merchant payment routes (authenticated via x-application-id header)
router
  .group(() => {
    router.post('/merchants/payment', [controllers.Payment, 'create'])
    router.get('/merchants/transactions', [controllers.Payment, 'index'])
    router.get('/merchants/transactions/:id', [controllers.Payment, 'show'])
  })
  .prefix('/api/v1')
```

**Exact patch** sur `start/routes.ts` — remplacer le bloc vide :

```diff
 // Authenticated API routes
 router
-  .group(() => {})
+  .group(() => {
+    // Merchant payment routes (authenticated via x-application-id header)
+    router.post('/merchants/payment', [controllers.Payment, 'create'])
+    router.get('/merchants/transactions', [controllers.Payment, 'index'])
+    router.get('/merchants/transactions/:id', [controllers.Payment, 'show'])
+  })
   .prefix('/api/v1')
   .use(middleware.auth())
```

**Verification:**
```bash
cd /home/contabo/mobgateway && PATH="$HOME/.bun/bin:$PATH" npx tsc --noEmit --pretty 2>&1 | head -10
```
Expected: No new errors.

**Commit:**
```bash
git add start/routes.ts
git commit -m "feat: add merchant payment API routes"
```

---

### Task 5: Créer le contrôleur de webhook Shwary

**Objective:** Recevoir les callbacks Shwary et mettre à jour le statut des transactions.

**Files:**
- Create: `app/controllers/shwary_webhook_controller.ts`

**Code complet:**

```typescript
import type { HttpContext } from '@adonisjs/core/http'
import Transaction from '#models/transaction'
import TransactionEvent from '#models/transaction_event'
import { providerRegistry } from '#pro/provider_registry'
import Provider from '#models/provider'

export default class ShwaryWebhookController {
  /**
   * POST /api/v1/webhooks/shwary
   *
   * Reçoit le callback de Shwary après un paiement.
   * Le provider Shwary gère le parsing du body (wrapper Pipedream ou direct).
   */
  async handle({ request, response }: HttpContext) {
    // Trouver le provider Shwary en base
    const provider = await Provider.findBy('code', 'shwary')
    if (!provider) {
      return response.status(404).json({ message: 'Provider shwary not found' })
    }

    // Construire la WebhookRequest pour le provider
    const webhookRequest = {
      method: request.method(),
      url: request.url(true),
      headers: request.headers(),
      body: request.body(),
    }

    try {
      const instance = await providerRegistry.getInstance('shwary', {
        sandbox: true,
        values: provider.config as Record<string, unknown>,
      })

      if (!instance) {
        return response.status(500).json({ message: 'Provider instance not available' })
      }

      const normalized = await instance.handleWebhook(webhookRequest)

      // Trouver la transaction par providerRef
      const transaction = await Transaction.query()
        .where('provider_ref', normalized.providerReference ?? normalized.id)
        .first()

      if (!transaction) {
        return response.status(404).json({
          message: 'Transaction not found',
          providerRef: normalized.providerReference ?? normalized.id,
        })
      }

      // Mettre à jour le statut
      const oldStatus = transaction.status
      transaction.status = normalized.status.toLowerCase() as string
      if (normalized.failureReason) {
        transaction.errorMessage = normalized.failureReason
      }
      await transaction.save()

      await TransactionEvent.create({
        transactionId: transaction.id,
        fromStatus: oldStatus,
        toStatus: transaction.status,
        payload: { source: 'webhook', normalized },
      })

      return response.status(200).json({ received: true })
    } catch (err) {
      return response.status(400).json({
        message: err instanceof Error ? err.message : 'Webhook processing failed',
      })
    }
  }
}
```

**Verification:**
```bash
cd /home/contabo/mobgateway && PATH="$HOME/.bun/bin:$PATH" npx tsc --noEmit --pretty 2>&1 | head -10
```
Expected: No new errors.

**Commit:**
```bash
git add app/controllers/shwary_webhook_controller.ts
git commit -m "feat: add Shwary webhook controller"
```

---

### Task 6: Ajouter la route webhook Shwary

**Objective:** Route publique pour le callback Shwary.

**Files:**
- Modify: `start/routes.ts`

**Modification:** Dans la section routes publiques (hors middleware auth), ajouter :

```typescript
// Shwary webhook (called by Shwary API, no auth required)
router.post('/api/v1/webhooks/shwary', [controllers.ShwaryWebhook, 'handle'])
```

À insérer juste après le bloc `router.get('/health', ...)`.

**Commit:**
```bash
git add start/routes.ts
git commit -m "feat: add Shwary webhook route"
```

---

### Task 7: Corriger le mock testConnection

**Objective:** Remplacer le mock par un vrai appel au provider `testConnection()`.

**Files:**
- Modify: `app/controllers/providers_controller.ts` (lignes 173-183)

**Patch — remplacer la méthode `testConnection` :**

```typescript
  async testConnection({ params, response }: HttpContext) {
    const provider = await Provider.find(params.id)
    if (!provider) {
      return response.status(404).json({ message: 'Provider not found' })
    }

    const instance = await providerRegistry.getInstance(provider.code, {
      sandbox: true,
      values: (provider.config as Record<string, unknown>) ?? {},
    })

    if (!instance) {
      return response.status(500).json({
        ok: false,
        message: `Provider ${provider.code} has no registered class`,
      })
    }

    try {
      const ok = await instance.testConnection()
      return response.status(200).json({
        ok,
        message: ok
          ? `Connection to ${provider.name} successful`
          : `Connection to ${provider.name} failed`,
      })
    } catch (err) {
      return response.status(200).json({
        ok: false,
        message: err instanceof Error ? err.message : 'Connection test failed',
      })
    }
  }
```

Ajouter l'import manquant en haut du fichier :
```typescript
import { providerRegistry } from '#pro/provider_registry'
```

**Commit:**
```bash
git add app/controllers/providers_controller.ts
git commit -m "fix: use real provider.testConnection() instead of mock"
```

---

### Task 8: Vérifier/ajouter les headers CORS pour l'API marchande

**Objective:** S'assurer que les clients marchands peuvent appeler l'API.

**Files:**
- Check: `config/cors.ts`

**Action:** Lire le fichier et vérifier que les routes `/api/v1/merchants/*` sont accessibles. Si `enabled: true` avec `origin: '*'` ou similaire, c'est bon.

**Verification:**
```bash
cd /home/contabo/mobgateway && grep -A5 'enabled\|origin' config/cors.ts
```

**Commit:** Uniquement si modification nécessaire.

---

### Task 9: Tester le flux complet avec curl

**Objective:** Vérifier de bout en bout qu'un paiement peut être initié.

**Prérequis:**
- Serveur lancé : `PATH="$HOME/.bun/bin:$PATH" bun run dev`
- Shwary lié aux opérateurs RDC/Kenya/Ouganda dans le dashboard admin
- `.env` complet avec `SHWARY_ID_MARCHAND`, `SHWARY_SECRET`, `SHWARY_PHONE_NUMBER`, `SHWARY_PASSWORD`

**Test curl :**

```bash
# 1. Health check
curl -s http://localhost:3333/health | jq

# 2. Login pour obtenir un token
TOKEN=$(curl -s -X POST http://localhost:3333/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gateway.local","password":"Admin123!"}' | jq -r '.token')

# 3. Initier un paiement (MSISDN RDC = +243)
curl -s -X POST http://localhost:3333/api/v1/merchants/payment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -H "x-application-id: app_845419ac-8796-4ed3-ac4a-30519bfb51c4" \
  -d '{
    "msisdn": "+243812345678",
    "amount": 1000,
    "currency": "CDF"
  }' | jq
```

**Résultat attendu :**
- Si Shwary répond → transaction avec `status: "pending"` ou `"completed"`
- Si pas de route → erreur `NO_ROUTE` (il faut lier Shwary aux opérateurs)
- Si credentials Shwary invalides → erreur `PROVIDER_ERROR`

**Cette étape est manuelle — l'utilisateur doit la faire.**

---

### Task 10: Lier Shwary aux opérateurs RDC/Kenya/Ouganda

**Objective:** Créer les `provider_routes` pour que le routing trouve Shwary.

**Action manuelle ou via SQL :**

```sql
-- Récupérer l'ID du provider shwary
SELECT id FROM providers WHERE code = 'shwary';
-- Exemple: prv_0ed450e9-1969-44d2-8e9c-1307e906b6f7

-- Récupérer les opérateurs pour DRC, Kenya, Ouganda
SELECT id, name, country_code FROM mobile_operators WHERE country_code IN ('CD', 'KE', 'UG');

-- Créer les routes (adapter les IDs)
INSERT INTO provider_routes (provider_id, mobile_operator_id, priority, is_active)
VALUES
  ('<shwary_id>', '<mpesa_rdc_id>', 1, true),
  ('<shwary_id>', '<airtel_rdc_id>', 1, true),
  ('<shwary_id>', '<orange_rdc_id>', 1, true),
  ('<shwary_id>', '<mpesa_ke_id>', 1, true),
  ('<shwary_id>', '<airtel_ke_id>', 1, true),
  ('<shwary_id>', '<mobile_money_ug_id>', 1, true);
```

**Commit:** Non (opération DB).

---

## Récapitulatif des fichiers

| Fichier | Action | Tâche |
|---|---|---|
| `app/validators/payment.ts` | Create | Task 1 |
| `app/services/payment_service.ts` | Create | Task 2 |
| `app/controllers/payment_controller.ts` | Create | Task 3 |
| `app/controllers/shwary_webhook_controller.ts` | Create | Task 5 |
| `start/routes.ts` | Modify | Tasks 4 + 6 |
| `app/controllers/providers_controller.ts` | Modify | Task 7 |

## Ordre d'exécution

```
Task 1 → Task 2 → Task 3 → Task 4 → Task 5 → Task 6 → Task 7 → Task 8 → Task 9 (manuel) → Task 10 (manuel)
```

Les tâches 1-7 peuvent être implémentées d'affilée. Les tâches 9 et 10 nécessitent l'intervention de l'utilisateur pour les credentials et le linking DB.
