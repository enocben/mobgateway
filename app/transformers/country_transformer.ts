import { BaseTransformer } from '@adonisjs/core/transformers'
import Country from '#models/country'
import ApplicationTransformer from '#transformers/application_transformer'

export default class CountryTransformer extends BaseTransformer<Country> {
  toObject() {
    return {
      ...this.pick(this.resource, [
        'id',
        'applicationId',
        'name',
        'createdAt',
        'currencyCode',
        'code',
        'phonePrefix',
      ]),
      application: ApplicationTransformer.transform(this.resource.application),
    }
  }
}
