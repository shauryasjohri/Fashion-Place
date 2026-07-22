const categoryService = require('../services/category.service')
const { success } = require('../utils/apiResponse')
const asyncHandler = require('../middleware/asyncHandler')

const listCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.listCategories()
  return success(res, categories)
})

const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body)
  return success(res, { status: 'ok', message: 'category created', category })
})

const updateCategory = asyncHandler(async (req, res) => {
  await categoryService.updateCategory(req.params.id, req.body)
  return success(res, { status: 'ok', message: 'category updated' })
})

const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(req.params.id)
  return success(res, { status: 'ok', message: 'category deleted' })
})

module.exports = { listCategories, createCategory, updateCategory, deleteCategory }
