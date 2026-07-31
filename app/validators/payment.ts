import vine from '@vinejs/vine'

/**
 * Validation pour initier un paiement (collection).
 */
export const createPaymentValidator = vine.compile(
  vine.object({
    msisdn: vine.string().trim().minLength(8).maxLength(20),
    amount: vine.number().min(1).max(999999999),
    currency: vine.string().trim().fixedLength(3),
    reference: vine.string().trim().minLength(1).maxLength(255).optional(),
    metadata: vine.object({}).allowUnknownProperties().optional(),
  })
)
