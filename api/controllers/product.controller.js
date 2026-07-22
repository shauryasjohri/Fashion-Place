const productService = require('../services/product.service')
const { success } = require('../utils/apiResponse')
const { transformIds } = require('../utils/transform')
const asyncHandler = require('../middleware/asyncHandler')

const listProducts = asyncHandler(async (req, res) => {
  const products = await productService.listProducts(req.query)
  return success(res, transformIds(products))
})

const createProduct = asyncHandler(async (req, res) => {
  await productService.createProduct(req.body)
  return success(res, { status: 'ok', message: 'product has been added' })
})

const updateProduct = asyncHandler(async (req, res) => {
  await productService.updateProduct(req.params.id, req.body)
  return success(res, { status: 'ok', message: 'product has been updated' })
})

const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id)
  return success(res, { status: 'ok', message: 'product has been deleted' })
})

const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id)
  return success(res, transformIds(product))
})

module.exports = { listProducts, createProduct, updateProduct, deleteProduct, getProductById }
