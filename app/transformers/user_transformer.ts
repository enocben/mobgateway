import type User from '#models/user'
import { BaseTransformer } from '@adonisjs/core/transformers'
import ApplicationTransformer from '#transformers/application_transformer'

export default class UserTransformer extends BaseTransformer<User> {
  toObject() {
    return {
      ...this.pick(this.resource, [
        'id',
        'email',
        'name',
        'createdAt',
        'updatedAt',
        'initials',
        'applicationId',
        'role',
        'status',
        'createdAt',
      ]),
      application: this.resource.application
        ? ApplicationTransformer.transform(this.resource.application)
        : undefined,
    }
  }
}
