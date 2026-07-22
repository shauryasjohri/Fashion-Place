function transformIds(obj) {
  if (!obj || typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map(transformIds)
  if (obj instanceof Date) return obj.toISOString()

  const result = {}
  for (const [key, value] of Object.entries(obj)) {
    if (key === 'id') {
      result['_id'] = value
    } else if (key === 'userId') {
      result['userID'] = typeof value === 'object' ? transformIds(value) : value
    } else if (key === 'productId') {
      result['productID'] = typeof value === 'object' ? transformIds(value) : value
    } else if (key === 'cartId') {
      result['cartID'] = typeof value === 'object' ? transformIds(value) : value
    } else if (key === 'orderId') {
      result['orderID'] = typeof value === 'object' ? transformIds(value) : value
    } else {
      result[key] = typeof value === 'object' ? transformIds(value) : value
    }
  }
  return result
}

function transformCartResponse(cart) {
  if (!cart) return null
  const { items, ...rest } = cart
  const transformed = transformIds(rest)
  transformed.products = (items || []).map(item => {
    const { product, ...itemRest } = item
    return {
      ...transformIds(itemRest),
      productID: product ? transformIds(product) : itemRest.productId,
    }
  })
  return transformed
}

function transformOrderResponse(order) {
  if (!order) return null
  const { items, ...rest } = order
  const transformed = transformIds(rest)
  transformed.products = (items || []).map(item => {
    const { product, ...itemRest } = item
    return {
      ...transformIds(itemRest),
      productID: product ? transformIds(product) : itemRest.productId,
    }
  })
  return transformed
}

module.exports = { transformIds, transformCartResponse, transformOrderResponse }
