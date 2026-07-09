import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import Application from '#models/application'

export default class TenantMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const apiKey = ctx.request.header('X-API-Key')

    if (!apiKey) {
      return ctx.response.status(401).json({
        error: 'Unauthorized',
        message: 'Missing API key. Provide X-API-Key header.',
      })
    }

    const application = await Application.findBy('apiKey', apiKey)

    if (!application) {
      return ctx.response.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid API key.',
      })
    }

    if (application.status !== 'active') {
      return ctx.response.status(403).json({
        error: 'Forbidden',
        message: 'Application is not active.',
      })
    }

    ctx.application = application
    await next()
  }
}
