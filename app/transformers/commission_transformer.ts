import { BaseTransformer } from '@adonisjs/core/transformers'
import Commission from '#models/commission'

export default class CommissionTransformer extends BaseTransformer<Commission> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'createdAt',
      'updatedAt',
      'type',
      'applicationId',
      'mobileOperatorId',
      'provider',
      'country',
      'currencyCode',
    ])
  }
}
