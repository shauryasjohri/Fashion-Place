const orderService = require('../services/order.service')
const { success } = require('../utils/apiResponse')
const asyncHandler = require('../middleware/asyncHandler')

const listOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.listOrders(req.query)
  return success(res, orders)
})

const createOrder = asyncHandler(async (req, res) => {
  const result = await orderService.createOrder(req.body, req.user.uid)
  return success(res, result)
})

const getStats = asyncHandler(async (req, res) => {
  const data = await orderService.getStats()
  return success(res, data)
})

const getOrder = asyncHandler(async (req, res) => {
  const result = await orderService.getOrder(req.params.id, req.user.uid, req.user.isAdmin)
  return success(res, result)
})

const updateOrder = asyncHandler(async (req, res) => {
  await orderService.updateOrder(req.params.id, req.body)
  return success(res, { status: 'ok', message: 'order has been updated' })
})

const deleteOrder = asyncHandler(async (req, res) => {
  await orderService.deleteOrder(req.params.id)
  return success(res, { status: 'ok', message: 'order has been deleted' })
})

const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getUserOrders(req.params.id)
  return success(res, orders)
})

module.exports = { listOrders, createOrder, getStats, getOrder, updateOrder, deleteOrder, getUserOrders }
