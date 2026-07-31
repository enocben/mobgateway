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
      mobileOperatorId: route.mobileOperatorId ? String(route.mobileOperatorId) : null,
      providerId: provider.id,
      providerRouteId: route.providerRoute.id,
      idempotencyKey,
      txType: 'collection',
      msisdn: params.msisdn,
      reference,
      amount: String(params.amount),
      currency: params.currency,
      fxRate: '1.0',
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
        sandbox: true,
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
