import config from '@/config'

let _getToken = null

export function setTokenProvider(fn) {
  _getToken = fn
}

async function authHeaders() {
  const token = _getToken ? await _getToken() : null
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function api(path, options = {}) {
  const headers = { ...options.headers, ...(await authHeaders()) }
  const resp = await fetch(`${config.apiUrl}${path}`, { ...options, headers })
  return resp.json()
}

export async function listUsers() {
  return api('/users')
}

export async function getUser(id) {
  return api(`/users/${id}`)
}

export async function deleteUser(id) {
  return api(`/users/${id}`, { method: 'DELETE' })
}

export async function listProducts(query = '') {
  return api(`/products${query}`)
}

export async function createProduct(data) {
  return api('/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function updateProduct(id, data) {
  return api(`/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function deleteProduct(id) {
  return api(`/products/${id}`, { method: 'DELETE' })
}

export async function listCategories() {
  return api('/categories')
}

export async function createCategory(name) {
  return api('/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  })
}

export async function updateCategory(id, name) {
  return api(`/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  })
}

export async function deleteCategory(id) {
  return api(`/categories/${id}`, { method: 'DELETE' })
}

export async function listOrders(query = '') {
  return api(`/orders${query}`)
}

export async function updateOrder(id, data) {
  return api(`/orders/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function deleteOrder(id) {
  return api(`/orders/${id}`, { method: 'DELETE' })
}

export default {
  setTokenProvider,
  listUsers, getUser, deleteUser,
  listProducts, createProduct, updateProduct, deleteProduct,
  listCategories, createCategory, updateCategory, deleteCategory,
  listOrders, updateOrder, deleteOrder,
}
