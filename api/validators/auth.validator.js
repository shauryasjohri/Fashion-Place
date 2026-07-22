const { z } = require('zod')
const { MIN_PASSWORD_LENGTH } = require('../utils/constants')

const register = z.object({
  fullname: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(MIN_PASSWORD_LENGTH),
})

module.exports = { register }
