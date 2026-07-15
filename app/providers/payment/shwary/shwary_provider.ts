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

/**
 * Shwary mobile money provider.
 *
 * Encapsule toute la communication avec l'API Shwary :
 * authentification, création de paiement, status, webhooks, etc.
 * Convertit les réponses Shwary vers les types communs de l'application.
 */
export default class ShwaryProvider extends BasePaymentProvider {
  readonly provider = 'shwary'
  readonly label = 'Shwary'
  readonly description =
    'Shwary mobile money aggregator — supports multiple operators across Africa'
  readonly icon = '📡'

  private baseUrl = env.get('SHWARY_BASE_URL')
  private apiKey: string = env.get('SHWARY_ID_MARCHAND')
  private apiSecret: string = env.get('SHWARY_SECRET')

  // ── Initialisation ──────────────────────────────────────────────────────

  async initialize(config: ProviderConfig): Promise<void> {
    this.apiKey = (config.values.apiKey as string) ?? null
    this.apiSecret = (config.values.apiSecret as string) ?? null

    if (config.values.baseUrl) {
      this.baseUrl = config.values.baseUrl as string
    }
  }

  // ── Helpers ─────────────────────────────────────────────────────────────

  private buildHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'x-merchant-id': this.apiKey,
      'x-merchant-key': this.apiSecret,
    }
  }

  /** Mapper un statut Shwary → PaymentStatus */
  private mapStatus(raw: string): PaymentStatus {
    switch (raw?.toUpperCase()) {
      case 'SUBMITTED':
      case 'PENDING':
        return PaymentStatus.PENDING
      case 'PROCESSING':
        return PaymentStatus.PROCESSING
      case 'COMPLETED':
      case 'SUCCESS':
        return PaymentStatus.COMPLETED
      case 'FAILED':
        return PaymentStatus.FAILED
      case 'CANCELLED':
        return PaymentStatus.CANCELLED
      default:
        return PaymentStatus.PENDING
    }
  }

  /** Construire une PaymentTransaction depuis une réponse Shwary */
  private normalize(raw: any, phoneNumber: string): PaymentTransaction {
    return {
      id: raw.transactionId ?? raw.id ?? '',
      reference: raw.reference ?? '',
      amount: Number(raw.amount ?? 0),
      currency: raw.currency ?? '',
      phoneNumber,
      status: this.mapStatus(raw.status),
      providerReference: raw.transactionId ?? raw.id ?? undefined,
      failureReason: raw.message ?? raw.error ?? undefined,
      metadata: raw.metadata ?? undefined,
      createdAt: raw.createdAt ? new Date(raw.createdAt) : new Date(),
      completedAt: raw.completedAt ? new Date(raw.completedAt) : undefined,
    }
  }

  // ── Paiement ────────────────────────────────────────────────────────────

  async createPayment(request: PaymentRequest): Promise<PaymentTransaction> {
    if (!this.apiKey) {
      throw new Error('Shwary provider not configured: missing apiKey')
    }

    const response = await fetch(`${this.baseUrl}/payments/collect`, {
      method: 'POST',
      headers: this.buildHeaders(),
      body: JSON.stringify({
        phone: request.phoneNumber,
        amount: request.amount,
        currency: request.currency,
        reference: request.reference,
        callback_url: request.callbackUrl,
        metadata: request.metadata ?? {},
      }),
    })

    const raw = await response.json()

    if (!response.ok) {
      throw new Error((raw as any).message ?? `Shwary HTTP ${response.status}`)
    }

    return this.normalize(raw, request.phoneNumber)
  }

  // ── Consultations ───────────────────────────────────────────────────────

  async getTransaction(transactionId: string): Promise<PaymentTransaction> {
    if (!this.apiKey) {
      throw new Error('Shwary provider not configured')
    }

    const response = await fetch(`${this.baseUrl}/payments/${transactionId}`, {
      headers: this.buildHeaders(),
    })
    const raw: any = await response.json()

    if (!response.ok) {
      throw new Error((raw as any).message ?? `Shwary HTTP ${response.status}`)
    }

    return this.normalize(raw, raw.phone ?? '')
  }

  async listTransactions(options?: TransactionFilter): Promise<PaymentTransaction[]> {
    if (!this.apiKey) {
      throw new Error('Shwary provider not configured')
    }

    const params = new URLSearchParams()
    if (options?.startDate) params.set('start_date', options.startDate.toISOString())
    if (options?.endDate) params.set('end_date', options.endDate.toISOString())
    if (options?.status) params.set('status', options.status)
    if (options?.limit) params.set('limit', String(options.limit))
    if (options?.offset) params.set('offset', String(options.offset))

    const response = await fetch(`${this.baseUrl}/payments?${params.toString()}`, {
      headers: this.buildHeaders(),
    })
    const raw = await response.json()

    if (!response.ok) {
      throw new Error((raw as any).message ?? `Shwary HTTP ${response.status}`)
    }

    const list = Array.isArray(raw) ? raw : ((raw as any).data ?? [])
    return list.map((item: any) => this.normalize(item, item.phone ?? ''))
  }

  // ── Webhooks ────────────────────────────────────────────────────────────

  async verifyWebhook(request: WebhookRequest): Promise<boolean> {
    const signature = request.headers['x-shwary-signature'] as string | undefined
    if (!signature || !this.apiSecret) return false

    // Shwary signe avec HMAC-SHA256(body, secret)
    const bodyStr = typeof request.body === 'string' ? request.body : JSON.stringify(request.body)

    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(this.apiSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )
    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      hexToBytes(signature),
      encoder.encode(bodyStr)
    )

    return valid
  }

  async handleWebhook(request: WebhookRequest): Promise<PaymentTransaction> {
    const valid = await this.verifyWebhook(request)
    if (!valid) {
      throw new Error('Invalid webhook signature')
    }

    const body = typeof request.body === 'string' ? JSON.parse(request.body) : request.body

    return this.normalize(body, (body as any).phone ?? '')
  }

  // ── Tests ───────────────────────────────────────────────────────────────

  async testConnection(): Promise<boolean> {
    if (!this.apiKey) return false

    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        headers: this.buildHeaders(),
      })
      return response.ok
    } catch {
      return false
    }
  }

  async validateConfiguration(config: ProviderConfig): Promise<void> {
    const errors: string[] = []

    if (!config.values.apiKey || typeof config.values.apiKey !== 'string') {
      errors.push('apiKey is required and must be a string')
    }
    if (!config.values.apiSecret || typeof config.values.apiSecret !== 'string') {
      errors.push('apiSecret is required and must be a string')
    }
    if (config.values.baseUrl && typeof config.values.baseUrl !== 'string') {
      errors.push('baseUrl must be a string if provided')
    }

    if (errors.length > 0) {
      throw new Error(`Shwary configuration invalid: ${errors.join('; ')}`)
    }
  }
}

// ── Utilitaire ─────────────────────────────────────────────────────────────

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16)
  }
  return bytes
}
