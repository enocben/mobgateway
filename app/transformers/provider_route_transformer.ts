import { BaseTransformer } from '@adonisjs/core/transformers'
import ProviderRoute from '#models/provider_route'

export default class ProviderRouteTransformer extends BaseTransformer<ProviderRoute> {
  toObject() {
    return this.pick(this.resource, ['id', 'updatedAt', 'createdAt', 'mobileOperatorId', 'provider'])
  }
}
