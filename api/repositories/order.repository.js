const prisma = require('../lib/prisma')

const orderInclude = {
  items: {
    include: { product: { select: { id: true, title: true, price: true, image: true } } },
  },
}

async function findMany(where = {}) {
  return prisma.order.findMany({ where, include: orderInclude })
}

async function findById(id) {
  return prisma.order.findUnique({ where: { id }, include: orderInclude })
}

async function findFirst(where) {
  return prisma.order.findFirst({ where, include: orderInclude })
}

async function create(data) {
  return prisma.order.create({ data })
}

async function update(id, data) {
  return prisma.order.update({ where: { id }, data })
}

async function remove(id) {
  return prisma.order.delete({ where: { id } })
}

async function deleteItems(orderId) {
  return prisma.orderItem.deleteMany({ where: { orderId } })
}

async function createItems(data) {
  return prisma.orderItem.createMany({ data })
}

async function findSince(date) {
  return prisma.order.findMany({ where: { createdAt: { gte: date } }, select: { createdAt: true, amount: true } })
}

async function findByUserId(userId) {
  return prisma.order.findMany({ where: { userId }, include: orderInclude })
}

module.exports = {
  findMany,
  findById,
  findFirst,
  create,
  update,
  remove,
  deleteItems,
  createItems,
  findSince,
  findByUserId,
}
