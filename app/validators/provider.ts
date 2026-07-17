import vine from '@vinejs/vine'

/**
 * Validation pour lier un pays à un provider.
 */
export const attachCountryValidator = vine.compile(
  vine.object({
    countryId: vine.string().trim().minLength(1),
  })
)

/**
 * Validation pour créer une route (mobile operator) sur un provider.
 */
export const storeProviderRouteValidator = vine.compile(
  vine.object({
    mobileOperatorId: vine.string().trim().minLength(1),
    priority: vine.number().min(1).max(999).optional(),
  })
)

/**
 * Validation pour mettre à jour la configuration d'un provider.
 */
export const updateProviderValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(255).optional(),
    status: vine.enum(['active', 'inactive']).optional(),
    config: vine.object({}).allowUnknownProperties().optional(),
  })
)
