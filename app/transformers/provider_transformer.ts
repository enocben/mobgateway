import { BaseTransformer } from '@adonisjs/core/transformers'
import Provider from '#models/provider'
import ProviderRouteTransformer from '#transformers/provider_route_transformer'
import TransactionTransformer from '#transformers/transaction_transformer'

export default class ProviderTransformer extends BaseTransformer<Provider> {
  toObject() {
    return {
      ...this.pick(this.resource, [
        'id',
        'name',
        'code',
        'status',
        'createdAt',
        'config',
        'type',
        'updatedAt',
        'label',
        'description',
        'icon',
      ]),
      routes: ProviderRouteTransformer.transform(this.resource.routes),
      transactions: TransactionTransformer.transform(this.resource.transactions),
      countries: this.resource.countries?.map((c) => ({
        id: c.id,
        code: c.code,
        name: c.name,
        currencyCode: c.currencyCode,
      })) ?? [],
    }
  }
}
