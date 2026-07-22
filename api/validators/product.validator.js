const { z } = require('zod')

const query = z.object({
  new: z.string().optional().transform(v => v === 'true'),
  category: z.string().optional(),
})

const base = {
  title: z.string().min(1),
  description: z.string().min(1),
  image: z.string().url(),
  price: z.number().positive(),
  inStock: z.boolean().optional(),
  categories: z.array(z.string()).optional(),
  size: z.array(z.string()).optional(),
  color: z.array(z.string()).optional(),
}

const newProduct = z.object(base)

const update = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  image: z.string().url().optional(),
  price: z.number().positive().optional(),
  inStock: z.boolean().optional(),
  categories: z.array(z.string()).optional(),
  size: z.array(z.string()).optional(),
  color: z.array(z.string()).optional(),
})

module.exports = { query, new: newProduct, update }
