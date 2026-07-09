import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class UsersController {
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)
    const search = request.input('search')
    const role = request.input('role')
    const status = request.input('status')
    const organizationId = request.input('organization_id')

    const query = User.query().preload('organization')

    if (search) {
      query.where((q) => {
        q.where('name', 'ilike', `%${search}%`)
          .orWhere('email', 'ilike', `%${search}%`)
      })
    }

    if (role) query.where('role', role)
    if (status) query.where('status', status)
    if (organizationId) query.where('organization_id', Number(organizationId))

    const users = await query.orderBy('created_at', 'desc').paginate(page, limit)
    return response.status(200).json(users)
  }

  async store({ request, response }: HttpContext) {
    const { name, email, password, role, organizationId } = request.only(['name', 'email', 'password', 'role', 'organizationId'])

    if (!name || !email || !password) {
      return response.status(422).json({
        message: 'Validation failed',
        errors: {
          name: !name ? 'Name is required' : undefined,
          email: !email ? 'Email is required' : undefined,
          password: !password ? 'Password is required' : undefined,
        },
      })
    }

    const user = await User.create({
      organizationId: organizationId ? Number(organizationId) : null,
      name,
      email,
      password,
      role: role || 'readonly',
      status: 'active',
    })

    return response.status(201).json(user)
  }

  async show({ params, response }: HttpContext) {
    const user = await User.query()
      .where('id', params.id)
      .preload('organization')
      .preload('applications')
      .first()

    if (!user) {
      return response.status(404).json({ message: 'User not found' })
    }

    return response.status(200).json(user)
  }

  async update({ params, request, response }: HttpContext) {
    const user = await User.find(params.id)
    if (!user) {
      return response.status(404).json({ message: 'User not found' })
    }

    const { name, email, role, organizationId } = request.only(['name', 'email', 'role', 'organizationId'])

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return response.status(422).json({
          message: 'Validation failed',
          errors: { name: 'Name cannot be empty' },
        })
      }
      user.name = name
    }

    if (email !== undefined) {
      if (typeof email !== 'string' || !email.includes('@')) {
        return response.status(422).json({
          message: 'Validation failed',
          errors: { email: 'Invalid email format' },
        })
      }
      user.email = email
    }

    if (role !== undefined) {
      const validRoles = ['super_admin', 'admin', 'support', 'finance', 'developer', 'readonly']
      if (!validRoles.includes(role)) {
        return response.status(422).json({
          message: 'Validation failed',
          errors: { role: `Role must be one of: ${validRoles.join(', ')}` },
        })
      }
      user.role = role
    }

    if (organizationId !== undefined) {
      user.organizationId = organizationId ? Number(organizationId) : null
    }

    await user.save()
    return response.status(200).json(user)
  }

  async destroy({ params, response }: HttpContext) {
    const user = await User.find(params.id)
    if (!user) {
      return response.status(404).json({ message: 'User not found' })
    }

    user.status = 'suspended'
    await user.save()

    return response.status(200).json({ message: 'User suspended', user })
  }

  async suspend({ params, response }: HttpContext) {
    const user = await User.find(params.id)
    if (!user) {
      return response.status(404).json({ message: 'User not found' })
    }

    user.status = 'suspended'
    await user.save()

    return response.status(200).json({ message: 'User suspended', user })
  }

  async activate({ params, response }: HttpContext) {
    const user = await User.find(params.id)
    if (!user) {
      return response.status(404).json({ message: 'User not found' })
    }

    user.status = 'active'
    await user.save()

    return response.status(200).json({ message: 'User activated', user })
  }
}
