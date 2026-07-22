const categoryRepository = require('../repositories/category.repository')
const { NotFoundError } = require('../utils/errors')

async function listCategories() {
  return categoryRepository.findAll()
}

async function createCategory(body) {
  const { name } = body
  return categoryRepository.create({ name })
}

async function updateCategory(id, body) {
  const existing = await categoryRepository.findById(id)
  if (!existing) throw new NotFoundError('category not found')
  return categoryRepository.update(id, { name: body.name })
}

async function deleteCategory(id) {
  const existing = await categoryRepository.findById(id)
  if (!existing) throw new NotFoundError('category not found')
  return categoryRepository.remove(id)
}

module.exports = { listCategories, createCategory, updateCategory, deleteCategory }
