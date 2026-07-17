/**
 * Types pour les réponses de l'API Shwary.
 */

/** Corps d'une transaction retourné par l'API Shwary (création, consultation, webhook) */
export interface ShwaryTransaction {
  id: string
  userId: string
  amount: number
  currency: string
  type: 'deposit' | 'payout' | string
  status: 'submitted' | 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | string
  description: string | null
  recipientPhoneNumber: string
  referenceId: string
  metadata: Record<string, unknown> | null
  failureReason: string | null
  pretiumTransactionId: string
  payoutProviderTransactionId: string | null
  fees: number
  isReleased: boolean
  isSandbox: boolean
  redirectUrl: string | null
  completedAt: string | null
  txHash: string | null
  gelatoTaskId: string | null
  sponsoredGasWei: string | null
  sponsoredGasChainId: string | null
  callbackUrl: string | null
  createdAt: string
  updatedAt: string
}

/** Wrapper Pipedream autour d'un webhook Shwary */
export interface PipedreamWebhookWrapper {
  'step.trigger': {
    event: {
      body: ShwaryTransaction
    }
  }
}
