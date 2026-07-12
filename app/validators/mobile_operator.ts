import vine from '@vinejs/vine'

const prefixRule = vine.string().trim().minLength(1).maxLength(5)

export const createMobileOperatorValidator = vine.create({
  countryCode: vine.string().trim().minLength(2).maxLength(3),
  name: vine.string().trim().minLength(1).maxLength(255),
  logoUrl: vine.string().url().nullable().optional(),
  prefixes: vine.array(prefixRule).minLength(1),
})

export const updateMobileOperatorValidator = vine.create({
  countryCode: vine.string().trim().minLength(2).maxLength(3).optional(),
  name: vine.string().trim().minLength(1).maxLength(255).optional(),
  logoUrl: vine.string().url().nullable().optional(),
  isEnabled: vine.boolean().optional(),
  prefixes: vine.array(prefixRule).optional(),
})
