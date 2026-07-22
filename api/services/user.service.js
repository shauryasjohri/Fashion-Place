const userRepository = require('../repositories/user.repository')
const { NotFoundError, ForbiddenError } = require('../utils/errors')

async function listUsers(query) {
  return userRepository.findMany(query)
}

async function getCurrentUser(uid) {
  const user = await userRepository.findById(uid)
  if (!user) throw new NotFoundError('user not found')
  return user
}

async function updateUser(id, requesterUid, requesterIsAdmin, body) {
  if (requesterUid !== id && !requesterIsAdmin) {
    throw new ForbiddenError('you are not authorized to perform this action')
  }
  const data = {}
  if (body.fullname) data.fullname = body.fullname
  await userRepository.update(id, data)
}

async function deleteUser(id, requesterUid, requesterIsAdmin) {
  if (requesterUid !== id && !requesterIsAdmin) {
    throw new ForbiddenError('you are not authorized to perform this action')
  }
  try {
    await userRepository.remove(id)
  } catch (err) {
    if (err.code === 'P2025') throw new NotFoundError('user not found')
    throw err
  }
}

async function getUserById(id) {
  const user = await userRepository.findById(id)
  if (!user) throw new NotFoundError('user not found')
  return user
}

async function getStats() {
  const date = new Date()
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1))
  const users = await userRepository.findRegistrationsSince(lastYear)

  const monthlyStats = {}
  for (const user of users) {
    const month = user.createdAt.getMonth() + 1
    monthlyStats[month] = (monthlyStats[month] || 0) + 1
  }

  return Object.entries(monthlyStats).map(([month, total]) => ({
    _id: parseInt(month),
    total,
  }))
}

module.exports = { listUsers, getCurrentUser, updateUser, deleteUser, getUserById, getStats }
