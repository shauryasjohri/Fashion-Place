const crypto = require('crypto')
const Razorpay = require('razorpay')
const config = require('../config')
const cartRepository = require('../repositories/cart.repository')
const orderRepository = require('../repositories/order.repository')
const { BadRequestError } = require('../utils/errors')
const { transformIds, transformCartResponse } = require('../utils/transform')

let _razorpay = null
function getRazorpay() {
  if (!_razorpay) {
    _razorpay = new Razorpay({
      key_id: config.razorpay.keyId,
      key_secret: config.razorpay.keySecret,
    })
  }
  return _razorpay
}

function computeCartTotal(cart) {
  let total = 0
  for (const item of cart.items) {
    total += item.quantity * item.product.price
  }
  return total
}

async function createOrder(uid) {
  const cart = await cartRepository.findByUserId(uid)
  if (!cart || cart.items.length <= 0) throw new BadRequestError('cannot checkout an empty cart')

  const cartTotal = computeCartTotal(cart)
  const amountPaise = Math.round(cartTotal * 100)
  const receipt = `receipt_${Date.now()}`

  const razorpayOrder = await getRazorpay().orders.create({
    amount: amountPaise,
    currency: 'INR',
    receipt,
  })

  const products = cart.items.map(item => ({
    productID: transformIds(item.product),
    quantity: item.quantity,
  }))

  return {
    order_id: razorpayOrder.id,
    amount: amountPaise,
    currency: 'INR',
    receipt,
    finalOrder: {
      ...transformCartResponse(cart),
      products,
      amount: cartTotal,
    },
  }
}

async function verifyPayment(uid, body) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, address } = body

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new BadRequestError('missing payment details')
  }

  const expectedSignature = crypto
    .createHmac('sha256', config.razorpay.keySecret)
    .update(razorpay_order_id + '|' + razorpay_payment_id)
    .digest('hex')

  if (expectedSignature !== razorpay_signature) {
    throw new BadRequestError('payment signature verification failed')
  }

  const cart = await cartRepository.findByUserId(uid)
  if (!cart || cart.items.length <= 0) throw new BadRequestError('cart is empty')

  const cartTotal = computeCartTotal(cart)
  const addr = address || { street: 'abc street', city: 'abc city', state: 'abc state', zip: 'abc zip' }

  const order = await orderRepository.create({
    data: {
      userId: uid,
      amount: cartTotal,
      address: addr,
      status: 'confirmed',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      items: {
        create: cart.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      },
    },
  })

  await cartRepository.clearItems(cart.id)

  return { orderID: order.id }
}

module.exports = { createOrder, verifyPayment }
