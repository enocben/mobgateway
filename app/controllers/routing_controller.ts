import type { HttpContext } from '@adonisjs/core/http'
import RoutingService from '#services/routing_service'

export default class RoutingController {
  async resolveProvider({ request, response }: HttpContext) {
    const { msisdn } = request.only(['msisdn'])

    if (!msisdn) {
      return response.status(422).json({
        message: 'Validation failed',
        errors: { msisdn: 'MSISDN is required' },
      })
    }

    const routingService = new RoutingService()
    const result = await routingService.resolveMsisdn(msisdn)

    if (!result.countryCode) {
      return response.status(404).json({
        message: 'No country found for the given MSISDN',
      })
    }

    if (!result.mobileOperatorId) {
      return response.status(404).json({
        message: 'No mobile operator found for the given MSISDN',
        countryCode: result.countryCode,
      })
    }

    if (!result.provider) {
      return response.status(404).json({
        message: 'No provider route found for the given mobile operator',
        countryCode: result.countryCode,
        mobileOperatorId: result.mobileOperatorId,
      })
    }

    return response.status(200).json({
      countryCode: result.countryCode,
      nationalNumber: result.nationalNumber,
      mobileOperatorId: result.mobileOperatorId,
      provider: {
        id: result.provider.id,
        name: result.provider.name,
        code: result.provider.code,
        type: result.provider.type,
      },
      providerRoute: result.providerRoute ? {
        id: result.providerRoute.id,
        priority: result.providerRoute.priority,
      } : null,
    })
  }
}
