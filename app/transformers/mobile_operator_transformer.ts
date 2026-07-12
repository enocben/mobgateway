import { BaseTransformer } from '@adonisjs/core/transformers'
import MobileOperator from '#models/mobile_operator'
import CountryTransformer from '#transformers/country_transformer'
import OperatorPrefixTransformer from '#transformers/operator_prefix_transformer'

export default class MobileOperatorTransformer extends BaseTransformer<MobileOperator> {
  toObject() {
    return {
      ...this.pick(this.resource, [
        'id',
        'name',
        'applicationId',
        'countryCode',
        'logoUrl',
        'isEnabled',
        'createdAt',
        'updatedAt',
      ]),
      country: CountryTransformer.transform(this.resource.country),
      prefixes: OperatorPrefixTransformer.transform(this.resource.prefixes),
    }
  }
}
