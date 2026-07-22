const productRepository = require('../repositories/product.repository')
const categoryRepository = require('../repositories/category.repository')
const { NotFoundError } = require('../utils/errors')

async function listProducts(query) {
  const products = await productRepository.findMany(query)
  return products
}

async function getProductById(id) {
  const product = await productRepository.findById(id)
  if (!product) throw new NotFoundError('product not found')
  return product
}

async function createProduct(body) {
  const { categories, size, color, ...productData } = body
  await productRepository.create({
    ...productData,
    sizes: size || [],
    colors: color || [],
    categories: categories && categories.length > 0
      ? {
          create: categories.map(name => ({
            category: {
              connectOrCreate: {
                where: { name },
                create: { name },
              },
            },
          })),
        }
      : undefined,
  })
}

async function updateProduct(id, body) {
  const { categories, size, color, ...updateData } = body

  if (categories) {
    await productRepository.deleteCategories(id)
    if (categories.length > 0) {
      const cats = await Promise.all(categories.map(async (name) => {
        const cat = await categoryRepository.upsert(name)
        return { productId: id, categoryId: cat.id }
      }))
      await productRepository.createCategories(cats)
    }
  }

  const data = {}
  if (updateData.title !== undefined) data.title = updateData.title
  if (updateData.description !== undefined) data.description = updateData.description
  if (updateData.image !== undefined) data.image = updateData.image
  if (updateData.price !== undefined) data.price = updateData.price
  if (updateData.inStock !== undefined) data.inStock = updateData.inStock
  if (size !== undefined) data.sizes = size
  if (color !== undefined) data.colors = color

  await productRepository.update(id, data)
}

async function deleteProduct(id) {
  try {
    await productRepository.remove(id)
  } catch (err) {
    if (err.code === 'P2025') throw new NotFoundError('product not found')
    throw err
  }
}

module.exports = { listProducts, getProductById, createProduct, updateProduct, deleteProduct }
