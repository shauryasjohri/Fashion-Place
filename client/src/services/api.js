const API_URL = import.meta.env.VITE_API_URL

let _getToken = null
let _currentUserId = null

export function setTokenProvider(fn) {
  _getToken = fn
}

export function setCurrentUserId(id) {
  _currentUserId = id
}

async function authHeaders() {
  const token = _getToken ? await _getToken() : null
  return token ? { "Authorization": `Bearer ${token}` } : {}
}

export async function fetchUserDetails() {
  const headers = await authHeaders()
  const resp = await fetch(API_URL + "/users/me", { headers })
  const { status, user } = await resp.json()
  if (status == "ok" && !user.avatarSrc) {
    user.avatarSrc = `https://avatars.dicebear.com/api/initials/${user.fullname}.svg`
  }
  return { status, user }
}

export async function fetchProducts(category, newArrivals = false) {
  let query = `new=${newArrivals ? "true" : "false"}${category ? "&category=" + category : ""}`
  const resp = await fetch(API_URL + "/products?" + query)
  return await resp.json()
}

export async function fetchProduct(id) {
  const resp = await fetch(API_URL + "/products/" + id)
  return await resp.json()
}

export async function createUserCart(products) {
  const headers = { "Content-Type": "application/json", ...(await authHeaders()) }
  const resp = await fetch(API_URL + "/carts", {
    method: "POST",
    headers,
    body: JSON.stringify(products.length ? { products } : {}),
  })
  return await resp.json()
}

export async function getUserCart() {
  const headers = await authHeaders()
  const resp = await fetch(API_URL + "/carts/" + _currentUserId, { headers })
  const cart = await resp.json()
  if (cart.products) {
    cart.products = cart.products.map(product => ({
      id: product.productID._id,
      title: product.productID.title,
      price: product.productID.price,
      image: product.productID.image,
      quantity: product.quantity,
    }))
  }
  return cart
}

export async function addProductsToCart(products) {
  const headers = { "Content-Type": "application/json", ...(await authHeaders()) }
  const resp = await fetch(API_URL + "/carts/" + _currentUserId, {
    method: "PUT",
    headers,
    body: JSON.stringify({ products }),
  })
  return await resp.json()
}

export async function removeProductFromCart(productID) {
  return await patchCart(productID, 0)
}

export async function patchCart(productID, quantity) {
  const headers = { "Content-Type": "application/json", ...(await authHeaders()) }
  const resp = await fetch(API_URL + "/carts/" + _currentUserId, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ productID, quantity }),
  })
  return await resp.json()
}

export async function clearCart() {
  const headers = await authHeaders()
  const resp = await fetch(API_URL + "/carts/clear", {
    method: "POST",
    headers,
  })
  return await resp.json()
}

export async function createRazorpayOrder() {
  const headers = { "Content-Type": "application/json", ...(await authHeaders()) }
  const resp = await fetch(API_URL + "/checkout/order", { method: "POST", headers })
  return await resp.json()
}

export async function verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature, address) {
  const headers = { "Content-Type": "application/json", ...(await authHeaders()) }
  const resp = await fetch(API_URL + "/checkout/verify", {
    method: "POST",
    headers,
    body: JSON.stringify({ razorpay_order_id, razorpay_payment_id, razorpay_signature, address }),
  })
  return await resp.json()
}

export async function createOrder(products, amount, address) {
  const headers = { "Content-Type": "application/json", ...(await authHeaders()) }
  const resp = await fetch(API_URL + "/orders", {
    method: "POST",
    headers,
    body: JSON.stringify({
      products: products.map(p => ({ productID: p.id, quantity: p.quantity })),
      amount,
      address,
    }),
  })
  return await resp.json()
}

export async function fetchAllOrders() {
  const headers = await authHeaders()
  const resp = await fetch(API_URL + "/orders/user/" + _currentUserId, { headers })
  return await resp.json()
}

export async function fetchOrderDetails(orderID) {
  const headers = await authHeaders()
  const resp = await fetch(API_URL + "/orders/" + orderID, { headers })
  return await resp.json()
}

export async function provisionUser(fullname, email) {
  const headers = { "Content-Type": "application/json", ...(await authHeaders()) }
  const resp = await fetch(API_URL + "/auth/provision", {
    method: "POST",
    headers,
    body: JSON.stringify({ fullname, email }),
  })
  return await resp.json()
}

export default {
  fetchUserDetails,
  fetchProducts,
  fetchProduct,
  createUserCart,
  getUserCart,
  addProductsToCart,
  removeProductFromCart,
  patchCart,
  clearCart,
  createRazorpayOrder,
  verifyPayment,
  createOrder,
  fetchAllOrders,
  fetchOrderDetails,
}
