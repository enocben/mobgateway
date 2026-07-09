import Commission from '#models/commission'

export default class CommissionService {
  async calculate(params: {
    applicationId: number
    countryCode: string
    currencyCode: string
    providerId: number
    mobileOperatorId?: number | null
    amount: number
  }) {
    const commissions = await Commission.query()
      .where((q) => {
        q.where('application_id', params.applicationId).orWhereNull('application_id')
      })
      .where((q) => {
        q.where('country_code', params.countryCode).orWhereNull('country_code')
      })
      .where((q) => {
        q.where('currency_code', params.currencyCode).orWhereNull('currency_code')
      })
      .where((q) => {
        q.where('provider_id', params.providerId).orWhereNull('provider_id')
      })
      .where((q) => {
        if (params.mobileOperatorId) {
          q.where('mobile_operator_id', params.mobileOperatorId).orWhereNull('mobile_operator_id')
        } else {
          q.whereNull('mobile_operator_id')
        }
      })
      .where((q) => {
        q.whereNull('min_amount').orWhere('min_amount', '<=', params.amount)
      })
      .where((q) => {
        q.whereNull('max_amount').orWhere('max_amount', '>=', params.amount)
      })

    // Sort by specificity: count of non-null FKs DESC
    commissions.sort((a, b) => {
      const specificityA = this.specificityScore(a)
      const specificityB = this.specificityScore(b)
      return specificityB - specificityA
    })

    let platformCommission = 0
    let appliedRule: any = null

    if (commissions.length > 0) {
      const rule = commissions[0]
      appliedRule = rule
      if (rule.type === 'fixed') {
        platformCommission = Number(rule.value)
      } else if (rule.type === 'percentage') {
        platformCommission = (params.amount * Number(rule.value)) / 100
      }
    }

    const netAmount = params.amount - platformCommission

    return {
      platformCommission,
      netAmount: Math.max(0, netAmount),
      appliedRule,
    }
  }

  private specificityScore(commission: Commission): number {
    let score = 0
    if (commission.applicationId !== null) score++
    if (commission.countryCode !== null) score++
    if (commission.currencyCode !== null) score++
    if (commission.providerId !== null) score++
    if (commission.mobileOperatorId !== null) score++
    return score
  }
}
