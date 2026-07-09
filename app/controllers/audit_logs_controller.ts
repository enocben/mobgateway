import type { HttpContext } from '@adonisjs/core/http'
import AuditLog from '#models/audit_log'

export default class AuditLogsController {
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 50)
    const { action, userId, entityType, dateFrom, dateTo } = request.only([
      'action', 'userId', 'entityType', 'dateFrom', 'dateTo',
    ])

    const query = AuditLog.query()
      .preload('user')
      .preload('application')
      .orderBy('created_at', 'desc')

    if (action) query.where('action', action)
    if (userId) query.where('user_id', Number(userId))
    if (entityType) query.where('entity_type', entityType)
    if (dateFrom) query.where('created_at', '>=', dateFrom)
    if (dateTo) query.where('created_at', '<=', dateTo)

    const logs = await query.paginate(page, limit)
    return response.status(200).json(logs)
  }

  async show({ params, response }: HttpContext) {
    const log = await AuditLog.query()
      .where('id', params.id)
      .preload('user')
      .preload('application')
      .first()

    if (!log) {
      return response.status(404).json({ message: 'Audit log not found' })
    }

    return response.status(200).json(log)
  }
}
