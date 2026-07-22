const cartService = require('../services/cart.service')
const { success } = require('../utils/apiResponse')
const asyncHandler = require('../middleware/asyncHandler')

const getAllCarts = asyncHandler(async (req, res) => {
  const carts = await cartService.getAllCarts()
  return success(res, carts)
})

const addToCart = asyncHandler(async (req, res) => {
  await cartService.addToCart(req.user.uid, req.body.products)
  return success(res, { status: 'ok', message: 'cart has been created' })
})

const clearCart = asyncHandler(async (req, res) => {
  await cartService.clearCart(req.user.uid)
  return success(res, { status: 'ok', message: 'cart has been cleared' })
})

const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getCart(req.params.id)
  return success(res, cart)
})

const updateCart = asyncHandler(async (req, res) => {
  await cartService.updateCart(req.params.id, req.body.products)
  return success(res, { status: 'ok', message: 'cart has been updated' })
})

const patchCartItem = asyncHandler(async (req, res) => {
  await cartService.patchCartItem(req.params.id, req.body.productID, req.body.quantity)
  return success(res, { status: 'ok', message: 'cart has been patched' })
})

const deleteCart = asyncHandler(async (req, res) => {
  await cartService.deleteCart(req.params.id)
  return success(res, { status: 'ok', message: 'cart has been deleted' })
})

module.exports = { getAllCarts, addToCart, clearCart, getCart, updateCart, patchCartItem, deleteCart }
