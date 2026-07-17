import {
  BasePaymentProvider,
  PaymentStatus,
  type PaymentRequest,
  type PaymentTransaction,
  type ProviderConfig,
  type TransactionFilter,
  type WebhookRequest,
} from '#pro/base_payment_provider'
import env from '#start/env'
import { ShwaryWebhookWrapper } from '#pro/payment/shwary/types/index'

/**
 * Shwary mobile money provider.
 *
 * Encapsule toute la communication avec l'API Shwary.
 * Convertit systématiquement les réponses Shwary vers les types communs.
 *
 * Config attendue dans ProviderConfig.values :
 *   merchantId  — identifiant marchand Shwary
 *   merchantKey — clé secrète marchand
 *   baseUrl     — (optionnel) override de l'URL de base
 */
export default class ShwaryProvider extends BasePaymentProvider {
  readonly provider = 'shwary'
  readonly label = 'Shwary'
  readonly description =
    'Shwary mobile money aggregator — supports DRC, Kenya, Uganda and more across Africa'
  readonly icon = '📡'

  private baseUrl = env.get('SHWARY_BASE_URL', 'https://api.shwary.com/api/v1')
  private merchantId: string = env.get('SHWARY_ID_MARCHAND', '')
  private merchantKey: string = env.get('SHWARY_SECRET', '')

  private sandbox = true

  // ── Détection pays ─────────────────────────────────────────────────────

  /** Mapping préfixes téléphoniques → code pays Shwary */
  private static readonly PREFIX_TO_COUNTRY: Record<string, string> = {
    '243': 'DRC',
    '254': 'KE',
    '256': 'UG',
  }

  /** Détecter le code pays Shwary à partir d'un numéro E.164 */
  private detectCountry(phoneNumber: string): string {
    const digits = phoneNumber.replace(/^\+/, '').replace(/\s/g, '')
    // Essayer les préfixes du plus long au plus court
    const prefixes = Object.keys(ShwaryProvider.PREFIX_TO_COUNTRY).sort(
      (a, b) => b.length - a.length
    )
    for (const prefix of prefixes) {
      if (digits.startsWith(prefix)) {
        return ShwaryProvider.PREFIX_TO_COUNTRY[prefix]
      }
    }
    throw new Error(
      `Unsupported country for phone: ${phoneNumber}. Supported prefixes: ${prefixes.join(', ')}`
    )
  }

  // ── Initialisation ──────────────────────────────────────────────────────

  async initialize(config: ProviderConfig): Promise<void> {
    this.sandbox = config.sandbox
    this.merchantId = (config.values.merchantId as string) ?? this.merchantId
    this.merchantKey = (config.values.merchantKey as string) ?? this.merchantKey
    if (config.values.baseUrl) {
      this.baseUrl = config.values.baseUrl as string
    }
  }

  // ── Helpers ─────────────────────────────────────────────────────────────

  private buildHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'x-merchant-id': this.merchantId,
      'x-merchant-key': this.merchantKey,
    }
  }

  /** Parser la réponse HTTP — lève si non-OK */
  private async parseResponse<T>(res: Response): Promise<T> {
    const text = await res.text()
    let json: unknown
    try {
      json = JSON.parse(text)
    } catch {
      throw new Error(`Shwary non-JSON response (${res.status}): ${text}`)
    }
    if (!res.ok) {
      const err = json as { message?: string; statusCode?: number }
      throw new Error(`[${err.statusCode ?? res.status}] ${err.message ?? JSON.stringify(json)}`)
    }
    return json as T
  }

  /** Mapper un statut Shwary → PaymentStatus */
  private mapStatus(raw: string | undefined): PaymentStatus {
    switch (raw?.toLowerCase()) {
      case 'submitted':
      case 'pending':
        return PaymentStatus.PENDING
      case 'processing':
        return PaymentStatus.PROCESSING
      case 'completed':
      case 'success':
        return PaymentStatus.COMPLETED
      case 'failed':
        return PaymentStatus.FAILED
      case 'cancelled':
        return PaymentStatus.CANCELLED
      default:
        return PaymentStatus.PENDING
    }
  }

  /** Shwary TransactionResponse → PaymentTransaction normalisé */
  private normalize(raw: Record<string, unknown>): PaymentTransaction {
    return {
      id: (raw.pretiumTransactionId as string) ?? (raw.id as string) ?? '',
      reference: (raw.referenceId as string) ?? (raw.reference as string) ?? '',
      amount: Number(raw.amount ?? 0),
      currency: (raw.currency as string) ?? '',
      phoneNumber: (raw.recipientPhoneNumber as string) ?? '',
      status: this.mapStatus(raw.status as string | undefined),
      providerReference: (raw.pretiumTransactionId as string) ?? (raw.id as string) ?? undefined,
      failureReason: (raw.failureReason as string) ?? undefined,
      metadata: {
        txHash: raw.txHash ?? null,
        isSandbox: raw.isSandbox ?? null,
        type: raw.type ?? null,
        userId: raw.userId ?? null,
        fees: raw.fees ?? null,
        isReleased: raw.isReleased ?? null,
        description: raw.description ?? null,
        payoutProviderTransactionId: raw.payoutProviderTransactionId ?? null,
        ...((raw.metadata as Record<string, unknown>) ?? {}),
      },
      createdAt: raw.createdAt ? new Date(raw.createdAt as string) : new Date(),
      completedAt: raw.completedAt ? new Date(raw.completedAt as string) : undefined,
    }
  }

  // ── Paiement ────────────────────────────────────────────────────────────

  async createPayment(request: PaymentRequest): Promise<PaymentTransaction> {
    const country = this.detectCountry(request.phoneNumber)

    const endpoint = this.sandbox
      ? `/merchants/payment/sandbox/${country}`
      : `/merchants/payment/${country}`

    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.buildHeaders(),
      body: JSON.stringify({
        amount: request.amount,
        clientPhoneNumber: request.phoneNumber,
        callbackUrl: request.callbackUrl,
      }),
    })

    const raw = await this.parseResponse<Record<string, unknown>>(res)
    return this.normalize(raw)
  }

  // ── Consultations ───────────────────────────────────────────────────────

  async getTransaction(transactionId: string): Promise<PaymentTransaction> {
    const res = await fetch(`${this.baseUrl}/merchants/transactions/${transactionId}`, {
      headers: this.buildHeaders(),
    })
    const raw = await this.parseResponse<Record<string, unknown>>(res)
    return this.normalize(raw)
  }

  async listTransactions(_options?: TransactionFilter): Promise<PaymentTransaction[]> {
    const res = await fetch(`${this.baseUrl}/merchants/transactions`, {
      headers: this.buildHeaders(),
    })
    const raw = await this.parseResponse<unknown>(res)

    // L'API Shwary peut retourner un objet ou un tableau
    if (Array.isArray(raw)) {
      return raw.map((item) => this.normalize(item as Record<string, unknown>))
    }

    const obj = raw as Record<string, unknown>
    if (Array.isArray(obj.data)) {
      return (obj.data as Record<string, unknown>[]).map((item) => this.normalize(item))
    }

    // Objet unique (la route GET /merchants/transactions retourne parfois un seul objet)
    return [this.normalize(obj)]
  }

  // ── Webhooks ────────────────────────────────────────────────────────────

  /**
   * Extraire le corps de transaction du webhook, en gérant l'éventuel wrapper Pipedream.
   * Format direct Shwary : { id, amount, ... }
   * Format Pipedream      : { "step.trigger": { "event": { "body": { ... } } } }
   */
  private extractBody(raw: Record<string, unknown>): Record<string, unknown> {
    const pipedream = raw as unknown as ShwaryWebhookWrapper
    if (pipedream['step.trigger']?.event?.body) {
      return pipedream['step.trigger'].event.body as unknown as Record<string, unknown>
    }
    return raw
  }

  async verifyWebhook(request: WebhookRequest): Promise<boolean> {
    // Shwary authentifie ses webhooks via un header x-api-key partagé
    const apiKey = request.headers['x-api-key'] as string | undefined
    if (!apiKey || !this.merchantKey) {
      // Fallback : pas de clé configurée = pas de vérification possible
      return !this.merchantKey || apiKey === this.merchantKey
    }
    return apiKey === this.merchantKey
  }

  async handleWebhook(request: WebhookRequest): Promise<PaymentTransaction> {
    const valid = await this.verifyWebhook(request)
    if (!valid) {
      throw new Error('Invalid Shwary webhook: x-api-key mismatch')
    }

    const rawBody =
      typeof request.body === 'string'
        ? (JSON.parse(request.body) as Record<string, unknown>)
        : (request.body as Record<string, unknown>)

    const body = this.extractBody(rawBody)
    return this.normalize(body)
  }

  // ── Tests ───────────────────────────────────────────────────────────────

  async testConnection(): Promise<boolean> {
    try {
      // Tente un health check ou une requête simple
      const res = await fetch(`${this.baseUrl}/merchants/transactions`, {
        headers: this.buildHeaders(),
      })
      // L'API peut renvoyer 200 ou 401 — 200 = config OK
      return res.ok || res.status === 401
    } catch {
      return false
    }
  }

  async validateConfiguration(config: ProviderConfig): Promise<void> {
    const errors: string[] = []

    if (!config.values.merchantId || typeof config.values.merchantId !== 'string') {
      errors.push('merchantId is required and must be a string')
    }
    if (!config.values.merchantKey || typeof config.values.merchantKey !== 'string') {
      errors.push('merchantKey is required and must be a string')
    }
    if (config.values.baseUrl && typeof config.values.baseUrl !== 'string') {
      errors.push('baseUrl must be a string if provided')
    }

    if (errors.length > 0) {
      throw new Error(`Shwary configuration invalid: ${errors.join('; ')}`)
    }
  }
}
