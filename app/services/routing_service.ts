import MobileOperator from '#models/mobile_operator'
import OperatorPrefix from '#models/operator_prefix'
import ProviderRoute from '#models/provider_route'
import Country from '#models/country'

export default class RoutingService {
  /**
   * Detect country by phone prefix. MSISDN format: "+243812345678" or "243812345678"
   */
  async detectCountry(msisdn: string): Promise<{ countryCode: string; nationalNumber: string } | null> {
    // Normalize MSISDN: strip leading + and any spaces
    const normalized = msisdn.replace(/^\+/, '').replace(/\s/g, '')

    // Get all countries with prefixes, sorted by prefix length DESC for best match
    const countries = await Country.query().orderBy('phone_prefix', 'desc')

    for (const country of countries) {
      const prefix = country.phonePrefix.replace('+', '')
      if (normalized.startsWith(prefix)) {
        const nationalNumber = normalized.slice(prefix.length)
        return { countryCode: country.code, nationalNumber }
      }
    }

    return null
  }

  /**
   * Detect operator by national number prefix within a country
   */
  async detectOperator(countryCode: string, nationalNumber: string): Promise<number | null> {
    // Get all operators in the country with their prefixes
    const operators = await MobileOperator.query()
      .where('country_code', countryCode)
      .where('is_enabled', true)
      .preload('prefixes')

    // Sort by prefix length DESC for best match
    for (const operator of operators) {
      const sortedPrefixes = operator.prefixes.sort((a, b) => b.prefix.length - a.prefix.length)
      for (const prefix of sortedPrefixes) {
        if (nationalNumber.startsWith(prefix.prefix)) {
          return operator.id
        }
      }
    }

    return null
  }

  /**
   * Find the best provider route for a given mobile operator
   */
  async resolveRoute(mobileOperatorId: number): Promise<{
    providerRoute: any
    provider: any
    alternatives: any[]
  } | null> {
    const routes = await ProviderRoute.query()
      .where('mobile_operator_id', mobileOperatorId)
      .where('is_active', true)
      .preload('provider')
      .orderBy('priority', 'asc')

    if (routes.length === 0) {
      return null
    }

    const best = routes[0]
    return {
      providerRoute: best,
      provider: best.provider,
      alternatives: routes.slice(1).map((r) => ({
        providerRoute: r,
        provider: r.provider,
        priority: r.priority,
      })),
    }
  }

  /**
   * Full MSISDN resolution: country → operator → route
   */
  async resolveMsisdn(msisdn: string): Promise<{
    countryCode: string
    nationalNumber: string
    mobileOperatorId: number | null
    providerRoute: any | null
    provider: any | null
  }> {
    // Step 1: Detect country
    const countryResult = await this.detectCountry(msisdn)
    if (!countryResult) {
      return {
        countryCode: '',
        nationalNumber: msisdn,
        mobileOperatorId: null,
        providerRoute: null,
        provider: null,
      }
    }

    // Step 2: Detect operator
    const operatorId = await this.detectOperator(countryResult.countryCode, countryResult.nationalNumber)

    if (!operatorId) {
      return {
        countryCode: countryResult.countryCode,
        nationalNumber: countryResult.nationalNumber,
        mobileOperatorId: null,
        providerRoute: null,
        provider: null,
      }
    }

    // Step 3: Resolve route
    const routeResult = await this.resolveRoute(operatorId)

    return {
      countryCode: countryResult.countryCode,
      nationalNumber: countryResult.nationalNumber,
      mobileOperatorId: operatorId,
      providerRoute: routeResult?.providerRoute || null,
      provider: routeResult?.provider || null,
    }
  }
}
