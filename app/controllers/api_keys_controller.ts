import type { HttpContext } from '@adonisjs/core/http'
import ApiKey from '#models/api_key'
import { randomUUID } from 'node:crypto'
import { createApiKeyValidator } from '#validators/api_key'

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

  async generateApiKey({ params, response, request, session }: HttpContext) {
    const { name } = await request.validateUsing(createApiKeyValidator)
    const rawKey = `mmg_${randomUUID().replace(/-/g, '')}`

    await ApiKey.create({
      applicationId: params.id,
      name,
      keyHash: ApiKey.generateKey(), // stocké en clair pour l'instant (à hasher plus tard)
      keyType: 'secret',
      permissions: JSON.stringify(['read', 'write']),
    })

    session.flash('success', 'API key generated')
    session.flash('generatedApiKey', rawKey)
    return response.redirect().back()
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

    const { name, permissions, expiresAt } = request.only([
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
