import vine from '@vinejs/vine'

export const createApiKeyValidator = vine.create({
  name: vine.string().trim().minLength(3).maxLength(50)
})
