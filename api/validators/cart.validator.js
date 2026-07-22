const { z } = require('zod')

const cartProduct = z.object({
  productID: z.string().min(1),
  quantity: z.number().int().positive().optional(),
})

const newCart = z.object({
  products: z.array(cartProduct).optional(),
})

const update = z.object({
  products: z.array(cartProduct).optional(),
})

const patch = z.object({
  productID: z.string().min(1),
  quantity: z.number().int().min(0),
})

module.exports = { new: newCart, update, patch }
