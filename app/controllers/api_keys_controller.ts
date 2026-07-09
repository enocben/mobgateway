import type { HttpContext } from '@adonisjs/core/http'
import ApiKey from '#models/api_key'

export default class ApiKeysController {
  async index({ params, request, response }: HttpContext) {
    const applicationId = Number(params.application_id)
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)

    const keys = await ApiKey.query()
      .where('application_id', applicationId)
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    return response.status(200).json(keys)
  }

  async store({ params, request, response }: HttpContext) {
    const applicationId = Number(params.application_id)
    const { name, permissions, ipRestrictions, expiresAt } = request.only([
      'name', 'permissions', 'ipRestrictions', 'expiresAt',
    ])

    if (!name) {
      return response.status(422).json({
        message: 'Validation failed',
        errors: { name: 'Name is required' },
      })
    }

    const apiKey = await ApiKey.create({
      applicationId,
      key: ApiKey.generateKey(),
      name,
      permissions: permissions || ['read'],
      ipRestrictions: ipRestrictions || null,
      expiresAt: expiresAt || null,
      lastUsedAt: null,
    })

    return response.status(201).json(apiKey)
  }

  async show({ params, response }: HttpContext) {
    const applicationId = Number(params.application_id)

    const apiKey = await ApiKey.query()
      .where('id', params.id)
      .where('application_id', applicationId)
      .preload('application')
      .first()

    if (!apiKey) {
      return response.status(404).json({ message: 'API key not found' })
    }

    return response.status(200).json(apiKey)
  }

  async update({ params, request, response }: HttpContext) {
    const applicationId = Number(params.application_id)

    const apiKey = await ApiKey.query()
      .where('id', params.id)
      .where('application_id', applicationId)
      .first()

    if (!apiKey) {
      return response.status(404).json({ message: 'API key not found' })
    }

    const { name, permissions, ipRestrictions, expiresAt } = request.only([
      'name', 'permissions', 'ipRestrictions', 'expiresAt',
    ])

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return response.status(422).json({
          message: 'Validation failed',
          errors: { name: 'Name cannot be empty' },
        })
      }
      apiKey.name = name
    }

    if (permissions !== undefined) apiKey.permissions = permissions
    if (ipRestrictions !== undefined) apiKey.ipRestrictions = ipRestrictions
    if (expiresAt !== undefined) apiKey.expiresAt = expiresAt

    await apiKey.save()
    return response.status(200).json(apiKey)
  }

  async destroy({ params, response }: HttpContext) {
    const applicationId = Number(params.application_id)

    const apiKey = await ApiKey.query()
      .where('id', params.id)
      .where('application_id', applicationId)
      .first()

    if (!apiKey) {
      return response.status(404).json({ message: 'API key not found' })
    }

    await apiKey.delete()
    return response.status(200).json({ message: 'API key deleted' })
  }
}
