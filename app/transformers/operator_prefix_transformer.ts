import { BaseTransformer } from '@adonisjs/core/transformers'
import OperatorPrefix from '#models/operator_prefix'

export default class OperatorPrefixTransformer extends BaseTransformer<OperatorPrefix> {
  toObject() {
<<<<<<< Updated upstream
    return this.pick(this.resource, ['id', 'mobileOperatorId', 'prefix', 'createdAt'])
=======
    return this.pick(this.resource, ['id', 'mobileOperatorId', 'createdAt', 'prefix'])
>>>>>>> Stashed changes
  }
}
