import Webhook from '#models/webhook'
import WebhookDelivery from '#models/webhook_delivery'
import Transaction from '#models/transaction'
import { DateTime } from 'luxon'
import { createHmac } from 'node:crypto'
import axios from 'axios'

export default class WebhookService {
  /**
   * Hash a webhook secret for storage
   */
  static hashSecret(secret: string): string {
    return createHmac('sha256', 'mmg-webhook-secret-key').update(secret).digest('hex')
  }

  /**
   * Sign a webhook payload with HMAC
   */
  static signPayload(payload: object, secret: string): string {
    const body = JSON.stringify(payload)
    return createHmac('sha256', secret).update(body).digest('hex')
  }

  /**
   * Deliver webhook event to all active webhooks for an application
   */
  async deliverToApplication(applicationId: number, event: string, payload: Record<string, any>): Promise<void> {
    const webhooks = await Webhook.query()
      .where('application_id', applicationId)
      .where('status', 'active')

    for (const webhook of webhooks) {
      // Check if webhook is subscribed to this event
      const events = webhook.events
      if (!events.includes('*') && !events.includes(event)) {
        continue
      }

      await this.sendDelivery(webhook, event, payload)
    }
  }

  /**
   * Send a single webhook delivery with exponential backoff
   */
  private async sendDelivery(webhook: Webhook, event: string, payload: Record<string, any>): Promise<WebhookDelivery> {
    const delivery = await WebhookDelivery.create({
      webhookId: webhook.id,
      event,
      payload,
      status: 'pending',
      attempts: 0,
    })

    try {
      const maxAttempts = 5
      const baseDelay = 1000 // 1 second

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          const signature = WebhookService.signPayload(payload, webhook.secretHash)

          const response = await axios.post(webhook.url, payload, {
            headers: {
              'Content-Type': 'application/json',
              'X-MMG-Signature': signature,
              'X-MMG-Event': event,
              'X-MMG-Delivery-Id': String(delivery.id),
            },
            timeout: 10000,
          })

          delivery.status = 'success'
          delivery.responseStatus = response.status
          delivery.responseBody = JSON.stringify(response.data)
          delivery.attempts = attempt
          delivery.lastAttemptAt = DateTime.now()
          await delivery.save()
          return delivery
        } catch (error: any) {
          delivery.attempts = attempt
          delivery.lastAttemptAt = DateTime.now()

          if (error.response) {
            delivery.responseStatus = error.response.status
            delivery.responseBody = JSON.stringify(error.response.data)
          } else {
            delivery.responseBody = error.message
          }

          if (attempt === maxAttempts) {
            delivery.status = 'failed'
            await delivery.save()
            return delivery
          }

          // Exponential backoff: 1s, 2s, 4s, 8s, 16s
          const delay = baseDelay * Math.pow(2, attempt - 1)
          await new Promise((resolve) => setTimeout(resolve, delay))
        }
      }
    } catch (error) {
      delivery.status = 'failed'
      delivery.responseBody = 'Unexpected error during delivery'
      delivery.lastAttemptAt = DateTime.now()
      await delivery.save()
    }

    return delivery
  }

  /**
   * Retry a failed webhook delivery
   */
  async retryDelivery(delivery: WebhookDelivery): Promise<WebhookDelivery> {
    const webhook = await Webhook.findOrFail(delivery.webhookId)

    delivery.status = 'pending'
    delivery.attempts = 0
    await delivery.save()

    return this.sendDelivery(webhook, delivery.event, delivery.payload)
  }

  /**
   * Process an incoming webhook from a provider
   */
  async processIncoming(
    providerId: number,
    payload: Record<string, any>,
    signature?: string
  ): Promise<void> {
    // Verify signature if provided
    if (signature) {
      // TODO: Implement proper signature verification per provider
    }

    // Extract transaction reference from payload
    const externalRef = payload.reference || payload.transactionId || payload.id
    const status = this.mapStatus(payload.status || payload.state)

    // Find associated transaction
    const transaction = await Transaction.findBy('provider_ref', externalRef)
      || await Transaction.findBy('reference', externalRef)

    if (transaction) {
      // Update transaction status
      const oldStatus = transaction.status
      transaction.status = status as any
      transaction.metadata = {
        ...transaction.metadata,
        webhookPayload: payload,
      }
      await transaction.save()

      // Deliver webhook to application
      await this.deliverToApplication(transaction.applicationId, `transaction.${status}`, {
        transactionId: transaction.id,
        reference: transaction.reference,
        status,
        providerRef: externalRef,
        amount: transaction.amount,
        currency: transaction.currency,
      })
    }
  }

  /**
   * Map external status to internal status
   */
  private mapStatus(rawStatus: string): string {
    const statusMap: Record<string, string> = {
      success: 'completed',
      succeeded: 'completed',
      completed: 'completed',
      pending: 'processing',
      processing: 'processing',
      failed: 'failed',
      error: 'failed',
      cancelled: 'cancelled',
      refunded: 'cancelled',
    }
    const lower = rawStatus.toLowerCase()
    return statusMap[lower] || 'pending'
  }
}
