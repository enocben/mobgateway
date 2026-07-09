import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AdminMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    // ctx.auth is attached by auth middleware at runtime
    const authCtx = ctx as any
    const user = authCtx.auth?.user

    if (!user || !['admin', 'super_admin'].includes(user.role)) {
      return ctx.response.status(403).json({
        error: 'Forbidden',
        message: 'Admin access required.',
      })
    }

    await next()
  }
}
