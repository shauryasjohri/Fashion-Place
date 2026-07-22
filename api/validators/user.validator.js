const { z } = require('zod')

const query = z.object({
  new: z.string().optional().transform(v => v === 'true'),
})

const update = z.object({
  fullname: z.string().min(1).optional(),
})

module.exports = { query, update }
