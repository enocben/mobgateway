import type { HttpContext } from '@adonisjs/core/http'
import Application from '#models/application'
import db from '@adonisjs/lucid/services/db'

export default class ApplicationsController {
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)
    const status = request.input('status')
    const search = request.input('search')

    const query = Application.query()

    if (status) {
      query.where('status', status)
    }

    if (search) {
      query.where((q) => {
        q.where('name', 'ilike', `%${search}%`)
          .orWhere('slug', 'ilike', `%${search}%`)
      })
    }

    const applications = await query.orderBy('created_at', 'desc').paginate(page, limit)
    return response.status(200).json(applications)
  }

  async store({ request, response }: HttpContext) {
    const { name, environment } = request.only(['name', 'environment'])

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return response.status(422).json({
        message: 'Validation failed',
        errors: { name: 'Name is required' },
      })
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    const existing = await Application.findBy('slug', slug)
    if (existing) {
      return response.status(422).json({
        message: 'Validation failed',
        errors: { name: 'An application with a similar name already exists' },
      })
    }

    const application = await Application.create({
      name: name.trim(),
      slug,
      environment: environment || 'sandbox',
      status: 'active',
    })

    return response.status(201).json(application)
  }

  async show({ params, response }: HttpContext) {
    const application = await Application.query()
      .where('id', params.id)
      .preload('users')
      .preload('countries')
      .first()

    if (!application) {
      return response.status(404).json({ message: 'Application not found' })
    }

    return response.status(200).json(application)
  }

  async update({ params, request, response }: HttpContext) {
    const application = await Application.find(params.id)
    if (!application) {
      return response.status(404).json({ message: 'Application not found' })
    }

    const { name, status, environment } = request.only(['name', 'status', 'environment'])

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return response.status(422).json({
          message: 'Validation failed',
          errors: { name: 'Name cannot be empty' },
        })
      }
      application.name = name.trim()
    }

    if (status !== undefined) {
      if (!['active', 'suspended'].includes(status)) {
        return response.status(422).json({
          message: 'Validation failed',
          errors: { status: 'Status must be active or suspended' },
        })
      }
      application.status = status
    }

    if (environment !== undefined) {
      if (!['sandbox', 'production'].includes(environment)) {
        return response.status(422).json({
          message: 'Validation failed',
          errors: { environment: 'Environment must be sandbox or production' },
        })
      }
      application.environment = environment
    }

    await application.save()
    return response.status(200).json(application)
  }

  async destroy({ params, response }: HttpContext) {
    const application = await Application.find(params.id)
    if (!application) {
      return response.status(404).json({ message: 'Application not found' })
    }

    application.status = 'suspended'
    await application.save()

    return response.status(200).json({ message: 'Application suspended', application })
  }

  async stats({ params, response }: HttpContext) {
    const application = await Application.find(params.id)
    if (!application) {
      return response.status(404).json({ message: 'Application not found' })
    }

    const [txCount, totalVolume, completedCount] = await Promise.all([
      db.from('transactions').where('application_id', application.id).count('* as count').first(),
      db.from('transactions')
        .where('application_id', application.id)
        .where('status', 'completed')
        .sum('amount as total')
        .first(),
      db.from('transactions')
        .where('application_id', application.id)
        .where('status', 'completed')
        .count('* as count')
        .first(),
    ])

    const totalTx = Number(txCount?.count ?? 0)
    const volume = Number(totalVolume?.total ?? 0)
    const rate = totalTx > 0 ? ((Number(completedCount?.count ?? 0) / totalTx) * 100).toFixed(2) : '0'

    return response.status(200).json({
      totalTransactions: totalTx,
      totalVolume: volume,
      successRate: `${rate}%`,
    })
  }
}
