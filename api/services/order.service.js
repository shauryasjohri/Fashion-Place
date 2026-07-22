const orderRepository = require('../repositories/order.repository')
const { NotFoundError, ForbiddenError } = require('../utils/errors')
const { transformOrderResponse } = require('../utils/transform')

async function listOrders(query) {
  const where = query.status ? { status: query.status } : {}
  const orders = await orderRepository.findMany(where)
  return orders.map(o => transformOrderResponse(o))
}

async function createOrder(data, uid) {
  const { products, amount, address } = data
  const order = await orderRepository.create({
    data: {
      userId: uid,
      amount,
      address,
      items: {
        create: products.map(p => ({
          productId: p.productID,
          quantity: p.quantity || 1,
        })),
      },
    },
  })
  return { orderID: order.id, status: 'ok', message: 'order has been created' }
}

async function getOrder(id, uid, isAdmin) {
  let order
  if (isAdmin) {
    order = await orderRepository.findById(id)
  } else {
    order = await orderRepository.findFirst({ id, userId: uid })
  }
  if (!order) throw new NotFoundError('order not found')
  return { status: 'ok', order: transformOrderResponse(order) }
}

async function updateOrder(id, body) {
  const { products, ...updateData } = body
  await orderRepository.update(id, updateData)
  if (products) {
    await orderRepository.deleteItems(id)
    await orderRepository.createItems(
      products.map(p => ({
        orderId: id,
        productId: p.productID,
        quantity: p.quantity || 1,
      }))
    )
  }
}

async function deleteOrder(id) {
  try {
    await orderRepository.remove(id)
  } catch (err) {
    if (err.code === 'P2025') throw new NotFoundError('order not found')
    throw err
  }
}

async function getStats() {
  const date = new Date()
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1))
  const previousMonth = new Date(date.setMonth(lastMonth.getMonth() - 1))

  const orders = await orderRepository.findSince(previousMonth)
  const monthlySales = {}
  for (const order of orders) {
    const month = order.createdAt.getMonth() + 1
    monthlySales[month] = (monthlySales[month] || 0) + order.amount
  }

  return Object.entries(monthlySales).map(([month, sales]) => ({
    _id: parseInt(month),
    sales,
  }))
}

async function getUserOrders(userId) {
  const orders = await orderRepository.findByUserId(userId)
  return orders.map(o => transformOrderResponse(o))
}

module.exports = { listOrders, createOrder, getOrder, updateOrder, deleteOrder, getStats, getUserOrders }
