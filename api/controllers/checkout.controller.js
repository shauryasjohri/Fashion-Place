const checkoutService = require('../services/checkout.service')
const { success } = require('../utils/apiResponse')
const asyncHandler = require('../middleware/asyncHandler')

const createOrder = asyncHandler(async (req, res) => {
  const result = await checkoutService.createOrder(req.user.uid)
  return success(res, { status: 'ok', ...result })
})

const verifyPayment = asyncHandler(async (req, res) => {
  const result = await checkoutService.verifyPayment(req.user.uid, req.body)
  return success(res, { status: 'ok', message: 'order created successfully', ...result })
})

module.exports = { createOrder, verifyPayment }
