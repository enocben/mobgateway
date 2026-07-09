import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import User from '#models/user'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    const { email, password, name } = request.only(['email', 'password', 'name'])

    if (!email || !password || !name) {
      return response.status(422).json({
        message: 'Validation failed',
        errors: {
          email: !email ? 'Email is required' : undefined,
          password: !password ? 'Password is required' : undefined,
          name: !name ? 'Name is required' : undefined,
        },
      })
    }

    if (typeof email !== 'string' || !email.includes('@')) {
      return response.status(422).json({
        message: 'Validation failed',
        errors: { email: 'Invalid email format' },
      })
    }

    if (typeof password !== 'string' || password.length < 6) {
      return response.status(422).json({
        message: 'Validation failed',
        errors: { password: 'Password must be at least 6 characters' },
      })
    }

    const existing = await User.findBy('email', email)
    if (existing) {
      return response.status(422).json({
        message: 'Validation failed',
        errors: { email: 'Email already taken' },
      })
    }

    const user = await User.create({ email, password, name, role: 'developer', status: 'active' })

    const token = await User.accessTokens.create(user)

    return response.status(201).json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status },
      token: token.value!.release(),
    })
  }

  async login({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    if (!email || !password) {
      return response.status(422).json({
        message: 'Validation failed',
        errors: {
          email: !email ? 'Email is required' : undefined,
          password: !password ? 'Password is required' : undefined,
        },
      })
    }

    const user = await User.findBy('email', email)
    if (!user) {
      return response.status(400).json({ message: 'Invalid credentials' })
    }

    const isValid = await hash.verify(user.password, password)
    if (!isValid) {
      return response.status(400).json({ message: 'Invalid credentials' })
    }

    if (user.status === 'suspended') {
      return response.status(403).json({ message: 'Account is suspended' })
    }

    const token = await User.accessTokens.create(user)

    return response.status(200).json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status },
      token: token.value!.release(),
    })
  }

  async logout(ctx: HttpContext) {
    const auth = (ctx as any).auth
    const user = auth.user!
    await User.accessTokens.delete(user, (user as any).currentAccessToken.identifier)
    return ctx.response.status(200).json({ message: 'Logged out successfully' })
  }

  async me(ctx: HttpContext) {
    const auth = (ctx as any).auth
    const user = auth.user!
    await user.load('applications')
    return ctx.response.status(200).json({ user })
  }

  async refresh(ctx: HttpContext) {
    const auth = (ctx as any).auth
    const user = auth.user!
    const token = await User.accessTokens.create(user)
    return ctx.response.status(200).json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status },
      token: token.value!.release(),
    })
  }
}
