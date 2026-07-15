import { BaseTransformer } from '@adonisjs/core/transformers'
import Transaction from '#models/transaction'
import ApplicationTransformer from '#transformers/application_transformer'

export default class TransactionTransformer extends BaseTransformer<Transaction> {
  toObject() {
    return {
      ...this.pick(this.resource, [
        'id',
        'provider',
        'mobileOperatorId',
        'createdAt',
        'updatedAt',
        'status',
        'applicationId',
        'providerRef',
        'amount',
        'metadata',
      ]),
      application: ApplicationTransformer.transform(this.resource.application),
    }
  }
}
