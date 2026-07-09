import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class MonitoringController {
  async getProviderHealth({ response }: HttpContext) {
    const providers = await db.from('providers').select('id', 'name', 'adapter', 'status', 'created_at')

    const result = await Promise.all(
      providers.map(async (p) => {
        const [txCount, failedCount] = await Promise.all([
          db.from('transactions').where('provider_id', p.id).count('* as count').first(),
          db.from('transactions')
            .where('provider_id', p.id)
            .where('status', 'failed')
            .count('* as count')
            .first(),
        ])

        const total = Number(txCount?.count ?? 0)
        const failed = Number(failedCount?.count ?? 0)
        const errorRateNum = total > 0 ? (failed / total) * 100 : 0
        const errorRate = total > 0 ? errorRateNum.toFixed(2) : '0'

        return {
          id: p.id,
          name: p.name,
          adapter: p.adapter,
          status: p.status,
          totalTransactions: total,
          failedTransactions: failed,
          errorRate: `${errorRate}%`,
          health: p.status === 'active' && errorRateNum < 5 ? 'healthy' : 'degraded',
        }
      })
    )

    return response.status(200).json(result)
  }

  async getQueueStats({ response }: HttpContext) {
    // Mock queue statistics
    return response.status(200).json({
      queues: [
        {
          name: 'transactions',
          pending: 12,
          processing: 3,
          completed: 1450,
          failed: 23,
          throughput: '45/min',
        },
        {
          name: 'webhooks',
          pending: 5,
          processing: 1,
          completed: 890,
          failed: 12,
          throughput: '12/min',
        },
        {
          name: 'notifications',
          pending: 0,
          processing: 0,
          completed: 2340,
          failed: 8,
          throughput: '30/min',
        },
      ],
      uptime: '72h 15m',
      memory: '256MB / 512MB',
      cpu: '12%',
    })
  }
}
