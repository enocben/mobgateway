import vine from '@vinejs/vine'

const prefixRule = vine.string().trim().minLength(1).maxLength(10)

export const createMobileOperatorValidator = vine.compile(
  vine.object({
    countryCode: vine.string().trim().minLength(2).maxLength(2),
    name: vine.string().trim().minLength(1).maxLength(255),
    logoUrl: vine.string().url().nullable().optional(),
    applicationId: vine.string().trim(),
    prefixes: vine.array(prefixRule).minLength(1),
  })
)

export const updateMobileOperatorValidator = vine.compile(
  vine.object({
    countryCode: vine.string().trim().minLength(2).maxLength(2).optional(),
    name: vine.string().trim().minLength(1).maxLength(255).optional(),
    logoUrl: vine.string().url().nullable().optional(),
    isEnabled: vine.boolean().optional(),
    prefixes: vine.array(prefixRule).optional(),
  })
)
