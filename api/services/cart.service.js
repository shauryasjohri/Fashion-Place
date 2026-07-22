const cartRepository = require('../repositories/cart.repository')
const { NotFoundError } = require('../utils/errors')
const { transformCartResponse } = require('../utils/transform')

async function getAllCarts() {
  const carts = await cartRepository.findAll()
  return carts.map(c => transformCartResponse(c))
}

async function addToCart(uid, products) {
  const cart = await cartRepository.findOrCreate(uid)
  if (products && products.length > 0) {
    for (const p of products) {
      await cartRepository.upsertItem(cart.id, p.productID, p.quantity || 1)
    }
  }
}

async function clearCart(uid) {
  const cart = await cartRepository.findByUserId(uid)
  if (cart) {
    await cartRepository.clearItems(cart.id)
  }
}

async function getCart(uid) {
  const cart = await cartRepository.findByUserId(uid)
  return transformCartResponse(cart)
}

async function updateCart(uid, products) {
  const cart = await cartRepository.findOrCreate(uid)
  if (products && products.length > 0) {
    for (const p of products) {
      await cartRepository.upsertItem(cart.id, p.productID, p.quantity || 1)
    }
  }
}

async function patchCartItem(uid, productID, quantity) {
  const cart = await cartRepository.findByUserId(uid)
  if (!cart) throw new NotFoundError('cart not found')

  if (quantity === 0) {
    await cartRepository.deleteItem(cart.id, productID)
  } else {
    const existing = await cartRepository.findItem(cart.id, productID)
    if (existing) {
      await cartRepository.upsertItem(cart.id, productID, quantity)
    }
  }
}

async function deleteCart(uid) {
  const cart = await cartRepository.findByUserId(uid)
  if (cart) {
    await cartRepository.clearItems(cart.id)
    await cartRepository.remove(cart.id)
  }
}

module.exports = { getAllCarts, addToCart, clearCart, getCart, updateCart, patchCartItem, deleteCart }
