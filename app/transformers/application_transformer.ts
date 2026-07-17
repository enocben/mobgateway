import { BaseTransformer } from '@adonisjs/core/transformers'
import Application from '#models/application'
import ApiKeyTransformer from '#transformers/api_key_transformer'

export default class ApplicationTransformer extends BaseTransformer<Application> {
  toObject() {
    return {
      ...this.pick(this.resource, [
      'id',
      'name',
      'slug',
      'status',
      'createdAt',
    ]),
      apiKeys: this.resource.apiKeys
        ? ApiKeyTransformer.transform(this.resource.apiKeys)
        : undefined
    }
  }
}
