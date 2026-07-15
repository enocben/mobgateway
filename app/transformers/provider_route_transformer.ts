import { BaseTransformer } from '@adonisjs/core/transformers'
import ProviderRoute from '#models/provider_route'

export default class ProviderRouteTransformer extends BaseTransformer<ProviderRoute> {
  toObject() {
    return {
      ...this.pick(this.resource, [
        'id',
        'createdAt',
        'updatedAt',
        'mobileOperatorId',
        'priority',
        'isActive',
        'providerId',
      ]),
      mobileOperator: this.resource.mobileOperator
        ? {
            id: this.resource.mobileOperator.id,
            name: this.resource.mobileOperator.name,
            countryCode: this.resource.mobileOperator.countryCode,
          }
        : null,
    }
  }
}
