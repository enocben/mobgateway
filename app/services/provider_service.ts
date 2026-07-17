import db from '@adonisjs/lucid/services/db'

import Country from '#models/country'
import MobileOperator from '#models/mobile_operator'
import Provider from '#models/provider'

export interface ProviderStats {
  totalTransactions: number
  totalVolume: number
  successRate: number
}

export interface ProviderDetail {
  provider: Provider
  availableCountries: Country[]
  availableOperators: MobileOperator[]
  stats: ProviderStats
}

export class ProviderService {
  public async getDetail(
    applicationId: string,
    providerId: string
  ): Promise<ProviderDetail> {
    const provider = await this.getProvider(providerId, applicationId)

    const linkedCountryIds = provider.countries.map((country) => country.id)

    const [availableCountries, availableOperators, stats] = await Promise.all([
      this.getAvailableCountries(applicationId, linkedCountryIds),
      this.getAvailableOperators(applicationId, linkedCountryIds),
      this.getStats(provider.id),
    ])

    return {
      provider,
      availableCountries,
      availableOperators,
      stats,
    }
  }

  private async getProvider(providerId: string, applicationId: string): Promise<Provider> {
    return Provider.query()
      .where('id', providerId)
      .preload('routes', (query) => {
        query
          .preload('mobileOperator')
          .orderBy('priority', 'asc')
      })
      .preload('transactions', (query) => {
        query
          .preload('application')
          .orderBy('createdAt', 'desc')
          .limit(20)
      })
      .preload('countries', (query) => {
        query.where('applicationId', applicationId)
      })
      .firstOrFail()
  }

  private async getAvailableCountries(
    applicationId: string,
    linkedCountryIds: string[]
  ): Promise<Country[]> {
    const query = Country.query()
      .where('application_id', applicationId)
      .orderBy('name', 'asc')

    if (linkedCountryIds.length > 0) {
      query.whereNotIn('id', linkedCountryIds)
    }

    return query
  }

  private async getAvailableOperators(
    applicationId: string,
    countryIds: string[]
  ): Promise<MobileOperator[]> {
    if (countryIds.length === 0) {
      return []
    }

    return MobileOperator.query()
      .where('application_id', applicationId)
      .whereIn('country_id', countryIds)
      .preload('country')
      .orderBy('name', 'asc')
  }

  private async getStats(providerId: string): Promise<ProviderStats> {
    const stats = await db
      .from('transactions')
      .where('provider_id', providerId)
      .select(
        db.raw('COUNT(*)::int as total'),
        db.raw(`
          COUNT(*) FILTER (WHERE status = 'completed')::int as completed
        `),
        db.raw(`
          COALESCE(
            SUM(amount) FILTER (WHERE status = 'completed'),
            0
          ) as volume
        `)
      )
      .first()

    const totalTransactions = Number(stats?.total ?? 0)
    const completedTransactions = Number(stats?.completed ?? 0)

    return {
      totalTransactions,
      totalVolume: Number(stats?.volume ?? 0),
      successRate:
        totalTransactions === 0
          ? 0
          : Number(((completedTransactions / totalTransactions) * 100).toFixed(1)),
    }
  }
}
