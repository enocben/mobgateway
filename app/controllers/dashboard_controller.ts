import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class DashboardController {
  async getStats({ response }: HttpContext) {
    const [
      totalApps,
      totalUsers,
      totalTx,
      txVolume,
      totalRevenue,
      successCount,
    ] = await Promise.all([
      db.from('applications').count('* as count').first(),
      db.from('users').count('* as count').first(),
      db.from('transactions').count('* as count').first(),
      db.from('transactions')
        .where('status', 'completed')
        .sum('amount as total')
        .first(),
      db.from('transactions')
        .where('status', 'completed')
        .sum('commission as total')
        .first(),
      db.from('transactions')
        .where('status', 'completed')
        .count('* as count')
        .first(),
    ])

    const totalTransactions = Number(totalTx?.count ?? 0)
    const successRate = totalTransactions > 0
      ? `${((Number(successCount?.count ?? 0) / totalTransactions) * 100).toFixed(2)}%`
      : '0%'

    // Provider health: count active vs total
    const [activeProviders, totalProviders] = await Promise.all([
      db.from('providers').where('status', 'active').count('* as count').first(),
      db.from('providers').count('* as count').first(),
    ])

    return response.status(200).json({
      applications: Number(totalApps?.count ?? 0),
      users: Number(totalUsers?.count ?? 0),
      transactions: totalTransactions,
      volume: Number(txVolume?.total ?? 0),
      revenue: Number(totalRevenue?.total ?? 0),
      successRate,
      providers: {
        total: Number(totalProviders?.count ?? 0),
        active: Number(activeProviders?.count ?? 0),
      },
    })
  }
}
