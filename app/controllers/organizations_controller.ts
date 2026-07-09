import type { HttpContext } from '@adonisjs/core/http'
import Organization from '#models/organization'

export default class OrganizationsController {
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)
    const search = request.input('search')

    const query = Organization.query()

    if (search) {
      query.where('name', 'ilike', `%${search}%`)
    }

    const organizations = await query.orderBy('name', 'asc').paginate(page, limit)
    return response.status(200).json(organizations)
  }

  async store({ request, response }: HttpContext) {
    const { name } = request.only(['name'])

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return response.status(422).json({
        message: 'Validation failed',
        errors: { name: 'Name is required' },
      })
    }

    const organization = await Organization.create({
      name: name.trim(),
      kycStatus: 'pending',
      status: 'active',
    })

    return response.status(201).json(organization)
  }

  async show({ params, response }: HttpContext) {
    const organization = await Organization.query()
      .where('id', params.id)
      .preload('applications')
      .preload('users')
      .first()

    if (!organization) {
      return response.status(404).json({ message: 'Organization not found' })
    }

    return response.status(200).json(organization)
  }

  async update({ params, request, response }: HttpContext) {
    const organization = await Organization.find(params.id)
    if (!organization) {
      return response.status(404).json({ message: 'Organization not found' })
    }

    const { name, kycStatus, status } = request.only(['name', 'kycStatus', 'status'])

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return response.status(422).json({
          message: 'Validation failed',
          errors: { name: 'Name cannot be empty' },
        })
      }
      organization.name = name.trim()
    }

    if (kycStatus !== undefined) {
      if (!['pending', 'approved', 'rejected'].includes(kycStatus)) {
        return response.status(422).json({
          message: 'Validation failed',
          errors: { kycStatus: 'KYC status must be pending, approved, or rejected' },
        })
      }
      organization.kycStatus = kycStatus
    }

    if (status !== undefined) {
      if (!['active', 'suspended'].includes(status)) {
        return response.status(422).json({
          message: 'Validation failed',
          errors: { status: 'Status must be active or suspended' },
        })
      }
      organization.status = status
    }

    await organization.save()
    return response.status(200).json(organization)
  }

  async destroy({ params, response }: HttpContext) {
    const organization = await Organization.find(params.id)
    if (!organization) {
      return response.status(404).json({ message: 'Organization not found' })
    }

    organization.status = 'suspended'
    await organization.save()

    return response.status(200).json({ message: 'Organization suspended', organization })
  }
}
