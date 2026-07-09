import { BaseTransformer } from '@adonisjs/core/transformers'
import Application from '#models/application'

export default class ApplicationTransformer extends BaseTransformer<Application> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'name',
      'status',
      'createdAt',
    ])
  }
}
