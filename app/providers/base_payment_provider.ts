/**
 * Base abstract class for all payment providers.
 *
 * To add a new provider:
 * 1. Create a new class extending BasePaymentProvider
 * 2. Implement all abstract methods
 * 3. Place the file under app/providers/payment/<name>/
 * 4. The provider will be auto-discovered and synced to DB on startup
 */

export type ProviderCapability =
  | 'payment'
  | 'refund'
  | 'transfer'
  | 'payout'
  | 'balance'
  | 'webhook'

export interface PaymentRequest {
  /** MSISDN (phone number) of the payer */
  msisdn: string
  /** Amount in the smallest currency unit */
  amount: number
  /** ISO 4217 currency code */
  currency: string
  /** Unique reference for the transaction */
  reference: string
  /** Arbitrary metadata */
  metadata?: Record<string, unknown>
}

export interface PaymentResponse {
  /** Whether the payment was accepted by the provider */
  success: boolean
  /** Provider's transaction reference */
  providerRef?: string
  /** Human-readable status */
  status: 'pending' | 'completed' | 'failed'
  /** Error message if failed */
  errorMessage?: string
  /** Raw response for audit */
  raw?: unknown
}

export abstract class BasePaymentProvider {
  /** Unique identifier (e.g. "shwary", "airtel-money") */
  abstract readonly code: string

  /** Human-readable name */
  abstract readonly label: string

  /** Short description of the provider */
  abstract readonly description: string

  /** Icon identifier (emoji or path) */
  abstract readonly icon: string

  /** Capabilities supported by this provider */
  readonly capabilities: ProviderCapability[] = ['payment']

  /**
   * Initialize the provider with application-specific config.
   * Called once when the provider is instantiated.
   */
  abstract init(config: Record<string, unknown>): void

  /**
   * Create a payment (collection).
   * Called by the transaction flow.
   */
  abstract collectPayment(request: PaymentRequest): Promise<PaymentResponse>

  /**
   * Check the status of a payment by provider reference.
   */
  abstract getPaymentStatus(providerRef: string): Promise<PaymentResponse>
}
