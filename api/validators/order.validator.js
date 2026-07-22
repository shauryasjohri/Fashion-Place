const { z } = require('zod')
const { ALLOWED_ORDER_STATUS } = require('../utils/constants')

const query = z.object({
  status: z.enum(ALLOWED_ORDER_STATUS).optional(),
})

const orderProduct = z.object({
  productID: z.string().min(1),
  quantity: z.number().int().positive().optional(),
})

const newOrder = z.object({
  products: z.array(orderProduct).min(1),
  amount: z.number().positive(),
  address: z.any(),
  status: z.enum(ALLOWED_ORDER_STATUS).optional(),
})

const update = z.object({
  products: z.array(orderProduct).optional(),
  amount: z.number().positive().optional(),
  address: z.any().optional(),
  status: z.enum(ALLOWED_ORDER_STATUS).optional(),
})

module.exports = { query, new: newOrder, update }
