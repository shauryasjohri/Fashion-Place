const { z } = require('zod')

const create = z.object({
  name: z.string().min(1),
})

const update = z.object({
  name: z.string().min(1),
})

module.exports = { create, update }
