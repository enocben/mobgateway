import { BaseTransformer } from '@adonisjs/core/transformers'
import ApiKey from '#models/api_key'

export default class ApiKeyTransformer extends BaseTransformer<ApiKey> {
  toObject() {
    return this.pick(this.resource, ['id', 'applicationId', 'createdAt', 'name', 'keyType', 'revokedAt', 'lastUsedAt'])
  }
}
