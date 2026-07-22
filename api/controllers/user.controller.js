const userService = require('../services/user.service')
const { success, error } = require('../utils/apiResponse')
const { transformIds } = require('../utils/transform')
const asyncHandler = require('../middleware/asyncHandler')

const listUsers = asyncHandler(async (req, res) => {
  const users = await userService.listUsers(req.query)
  return success(res, transformIds(users))
})

const getMe = asyncHandler(async (req, res) => {
  const user = await userService.getCurrentUser(req.user.uid)
  return success(res, { status: 'ok', user: transformIds(user) })
})

const updateUser = asyncHandler(async (req, res) => {
  await userService.updateUser(req.params.id, req.user.uid, req.user.isAdmin, req.body)
  return success(res, { status: 'ok', message: 'user has been updated' })
})

const deleteUser = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params.id, req.user.uid, req.user.isAdmin)
  return success(res, { status: 'ok', message: 'user has been deleted' })
})

const getStats = asyncHandler(async (req, res) => {
  const data = await userService.getStats()
  return success(res, data)
})

const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id)
  return success(res, transformIds(user))
})

module.exports = { listUsers, getMe, updateUser, deleteUser, getStats, getUserById }
