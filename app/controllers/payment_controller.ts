import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { PaymentService, PaymentError } from '#services/payment_service'
import { createPaymentValidator } from '#validators/payment'
import Transaction from '#models/transaction'

@inject()
export default class PaymentController {
  constructor(protected paymentService: PaymentService) {}

  /**
   * POST /api/v1/merchants/payment
   *
   * Headers requis :
   *   x-application-id — identifiant de l'application
   *   Authorization     — Bearer token (via middleware auth)
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
