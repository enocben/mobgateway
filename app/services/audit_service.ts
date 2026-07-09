import AuditLog from '#models/audit_log'

export default class AuditService {
  static async log(params: {
    action: string
    entityType: string
    entityId: number
    oldValue?: Record<string, any> | null
    newValue?: Record<string, any> | null
    userId?: number | null
    applicationId?: number | null
    ctx?: any
  }) {
    const ipAddress = params.ctx?.request?.ip() || '127.0.0.1'
    const userAgent = params.ctx?.request?.header('User-Agent') || null

    await AuditLog.create({
      userId: params.userId || null,
      applicationId: params.applicationId || null,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      oldValue: params.oldValue || null,
      newValue: params.newValue || null,
      ipAddress,
      userAgent,
    })
  }
}
