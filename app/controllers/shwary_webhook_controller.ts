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
    const provider = await Provider.findBy('code', 'shwary')
    if (!provider) {
      return response.status(404).json({ message: 'Provider not found' })
    }

    const webhookRequest = {
      method: request.method(),
      url: request.url(true),
      headers: request.headers(),
      body: request.body(),
    }

    try {
      const instance = await providerRegistry.getInstance('shwary', {
        sandbox: true,
        values: (provider.config as Record<string, unknown>) ?? {},
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
      transaction.status = normalized.status.toLowerCase()
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
