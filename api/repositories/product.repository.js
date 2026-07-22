const prisma = require('../lib/prisma')

const productInclude = {
  categories: { include: { category: true } },
}

async function findMany(opts = {}) {
  const { new: isNew, category } = opts
  let products

  if (isNew) {
    products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' }, take: 5, include: productInclude })
  } else if (category) {
    products = await prisma.product.findMany({
      where: { categories: { some: { category: { name: category } } } },
      include: productInclude,
    })
  } else {
    products = await prisma.product.findMany({ include: productInclude })
  }

  return products.map(p => ({
    ...p,
    categories: p.categories.map(pc => pc.category.name),
  }))
}

async function findById(id) {
  const product = await prisma.product.findUnique({ where: { id }, include: productInclude })
  if (!product) return null
  return { ...product, categories: product.categories.map(pc => pc.category.name) }
}

async function create(data) {
  return prisma.product.create({ data })
}

async function update(id, data) {
  return prisma.product.update({ where: { id }, data })
}

async function remove(id) {
  return prisma.product.delete({ where: { id } })
}

async function deleteCategories(productId) {
  return prisma.productCategory.deleteMany({ where: { productId } })
}

async function createCategories(data) {
  return prisma.productCategory.createMany({ data })
}

module.exports = {
  findMany,
  findById,
  create,
  update,
  remove,
  deleteCategories,
  createCategories,
}
