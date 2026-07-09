import type { HttpContext } from '@adonisjs/core/http'
import Webhook from '#models/webhook'
import WebhookDelivery from '#models/webhook_delivery'
import WebhookService from '#services/webhook_service'

export default class WebhooksController {
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)
    const applicationId = request.input('application_id')

    const query = Webhook.query().preload('application')

    if (applicationId) {
      query.where('application_id', Number(applicationId))
    }

    const webhooks = await query.orderBy('created_at', 'desc').paginate(page, limit)
    return response.status(200).json(webhooks)
  }

  async store({ request, response }: HttpContext) {
    const { applicationId, url, secret, events } = request.only(['applicationId', 'url', 'secret', 'events'])

    if (!applicationId || !url || !secret) {
      return response.status(422).json({
        message: 'Validation failed',
        errors: {
          applicationId: !applicationId ? 'Application ID is required' : undefined,
          url: !url ? 'URL is required' : undefined,
          secret: !secret ? 'Secret is required' : undefined,
        },
      })
    }

    // Hash the secret
    const secretHash = WebhookService.hashSecret(secret)

    const webhook = await Webhook.create({
      applicationId: Number(applicationId),
      url,
      secretHash,
      status: 'active',
      events: events || ['*'],
    })

    return response.status(201).json(webhook)
  }

  async show({ params, response }: HttpContext) {
    const webhook = await Webhook.query()
      .where('id', params.id)
      .preload('application')
      .preload('deliveries')
      .first()

    if (!webhook) {
      return response.status(404).json({ message: 'Webhook not found' })
    }

    return response.status(200).json(webhook)
  }

  async update({ params, request, response }: HttpContext) {
    const webhook = await Webhook.find(params.id)
    if (!webhook) {
      return response.status(404).json({ message: 'Webhook not found' })
    }

    const { url, secret, status, events } = request.only(['url', 'secret', 'status', 'events'])

    if (url !== undefined) webhook.url = url
    if (secret !== undefined) webhook.secretHash = WebhookService.hashSecret(secret)
    if (status !== undefined) {
      if (!['active', 'inactive'].includes(status)) {
        return response.status(422).json({
          message: 'Validation failed',
          errors: { status: 'Status must be active or inactive' },
        })
      }
      webhook.status = status
    }
    if (events !== undefined) webhook.events = events

    await webhook.save()
    return response.status(200).json(webhook)
  }

  async destroy({ params, response }: HttpContext) {
    const webhook = await Webhook.find(params.id)
    if (!webhook) {
      return response.status(404).json({ message: 'Webhook not found' })
    }

    await webhook.delete()
    return response.status(200).json({ message: 'Webhook deleted' })
  }

  async deliveries({ params, request, response }: HttpContext) {
    const webhookId = Number(params.id)
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)

    const deliveries = await WebhookDelivery.query()
      .where('webhook_id', webhookId)
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    return response.status(200).json(deliveries)
  }

  async retryDelivery({ params, response }: HttpContext) {
    const delivery = await WebhookDelivery.find(params.id)
    if (!delivery) {
      return response.status(404).json({ message: 'Webhook delivery not found' })
    }

    try {
      const service = new WebhookService()
      const result = await service.retryDelivery(delivery)
      return response.status(200).json(result)
    } catch (error) {
      return response.status(500).json({ message: 'Failed to retry delivery', error: (error as Error).message })
    }
  }
}
