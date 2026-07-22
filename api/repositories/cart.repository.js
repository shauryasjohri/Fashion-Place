const prisma = require('../lib/prisma')

const cartInclude = {
  items: {
    include: { product: { select: { id: true, title: true, price: true, image: true } } },
  },
}

async function findByUserId(userId) {
  return prisma.cart.findUnique({ where: { userId }, include: cartInclude })
}

async function create(userId) {
  return prisma.cart.create({ data: { userId }, include: cartInclude })
}

async function findOrCreate(userId) {
  let cart = await findByUserId(userId)
  if (!cart) {
    cart = await create(userId)
  }
  return cart
}

async function findAll() {
  return prisma.cart.findMany({ include: cartInclude })
}

async function upsertItem(cartId, productId, quantity) {
  return prisma.cartItem.upsert({
    where: { cartId_productId: { cartId, productId } },
    create: { cartId, productId, quantity },
    update: { quantity },
  })
}

async function deleteItem(cartId, productId) {
  return prisma.cartItem.deleteMany({ where: { cartId, productId } })
}

async function findItem(cartId, productId) {
  return prisma.cartItem.findUnique({ where: { cartId_productId: { cartId, productId } } })
}

async function clearItems(cartId) {
  return prisma.cartItem.deleteMany({ where: { cartId } })
}

async function remove(cartId) {
  return prisma.cart.delete({ where: { id: cartId } })
}

module.exports = {
  findByUserId,
  create,
  findOrCreate,
  findAll,
  upsertItem,
  deleteItem,
  findItem,
  clearItems,
  remove,
}
