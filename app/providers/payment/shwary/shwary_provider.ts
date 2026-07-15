import { BasePaymentProvider } from '#pro/base_payment_provider'

/**
 * Shwary mobile money provider.
 *
 * Handles authentication, payment creation, and status checks
 * against the Shwary API.
 */
export default class ShwaryProvider extends BasePaymentProvider {
  readonly code = 'shwary'
  readonly label = 'Shwary'
  readonly description = 'Shwary mobile money aggregator — supports multiple operators across Africa'
  readonly icon = '📡'

  private baseUrl = 'https://api.shwary.com/v1'
  private apiKey: string | null = null
  private apiSecret: string | null = null

  init(config: Record<string, unknown>): void {
    this.apiKey = (config.apiKey as string) ?? null
    this.apiSecret = (config.apiSecret as string) ?? null

    if (config.baseUrl) {
      this.baseUrl = config.baseUrl as string
    }
  }

  private buildHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      'X-Shwary-Secret': this.apiSecret ?? '',
    }
  }

  async collectPayment(request: {
    msisdn: string
    amount: number
    currency: string
    reference: string
    metadata?: Record<string, unknown>
  }): Promise<{
    success: boolean
    providerRef?: string
    status: 'pending' | 'completed' | 'failed'
    errorMessage?: string
    raw?: unknown
  }> {
    if (!this.apiKey) {
      return {
        success: false,
        status: 'failed',
        errorMessage: 'Shwary provider not configured: missing apiKey',
      }
    }

    try {
      const response = await fetch(`${this.baseUrl}/payments/collect`, {
        method: 'POST',
        headers: this.buildHeaders(),
        body: JSON.stringify({
          phone: request.msisdn,
          amount: request.amount,
          currency: request.currency,
          reference: request.reference,
          metadata: request.metadata ?? {},
        }),
      })

      const raw = await response.json()

      if (!response.ok) {
        return {
          success: false,
          status: 'failed',
          errorMessage: (raw as any).message ?? `HTTP ${response.status}`,
          raw,
        }
      }

      return {
        success: true,
        providerRef: (raw as any).transactionId ?? (raw as any).id,
        status: 'pending',
        raw,
      }
    } catch (error) {
      return {
        success: false,
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  async getPaymentStatus(providerRef: string): Promise<{
    success: boolean
    providerRef?: string
    status: 'pending' | 'completed' | 'failed'
    errorMessage?: string
    raw?: unknown
  }> {
    if (!this.apiKey) {
      return {
        success: false,
        status: 'failed',
        errorMessage: 'Shwary provider not configured',
      }
    }

    try {
      const response = await fetch(`${this.baseUrl}/payments/${providerRef}`, {
        headers: this.buildHeaders(),
      })
      const raw = await response.json()

      if (!response.ok) {
        return {
          success: false,
          status: 'failed',
          errorMessage: (raw as any).message ?? `HTTP ${response.status}`,
          raw,
        }
      }

      const shwaryStatus = (raw as any).status as string
      const mappedStatus: 'pending' | 'completed' | 'failed' =
        shwaryStatus === 'SUCCESS' || shwaryStatus === 'COMPLETED' ? 'completed' :
        shwaryStatus === 'FAILED' || shwaryStatus === 'CANCELLED' ? 'failed' :
        'pending'

      return {
        success: mappedStatus === 'completed',
        providerRef: (raw as any).transactionId ?? providerRef,
        status: mappedStatus,
        raw,
      }
    } catch (error) {
      return {
        success: false,
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }
}
