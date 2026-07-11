import { BaseTransformer } from '@adonisjs/core/transformers'
import MobileOperator from '#models/mobile_operator'

export default class MobileOperatorTransformer extends BaseTransformer<MobileOperator> {
  toObject() {
    return {
      ...this.pick(this.resource, [
        'id',
        'applicationId',
        'countryCode',
        'name',
        'logoUrl',
        'isEnabled',
        'createdAt',
        'updatedAt',
      ]),
      prefixes: this.resource.prefixes?.map((p) => ({
        id: p.id,
        prefix: p.prefix,
      })) ?? [],
    }
  }
}
