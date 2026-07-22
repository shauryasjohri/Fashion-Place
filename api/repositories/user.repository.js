const prisma = require('../lib/prisma')

const userSelect = {
  id: true,
  fullname: true,
  email: true,
  isAdmin: true,
  createdAt: true,
  updatedAt: true,
}

async function findMany(query) {
  const orderBy = query.new ? { createdAt: 'desc' } : undefined
  const take = query.new ? 5 : undefined
  return prisma.user.findMany({ orderBy, take, select: userSelect })
}

async function findById(id) {
  return prisma.user.findUnique({ where: { id }, select: userSelect })
}

async function upsert(id, data) {
  return prisma.user.upsert({
    where: { id },
    create: { id, ...data, password: '' },
    update: data,
    select: { id: true, isAdmin: true },
  })
}

async function update(id, data) {
  return prisma.user.update({ where: { id }, data })
}

async function remove(id) {
  return prisma.user.delete({ where: { id } })
}

async function findRegistrationsSince(date) {
  return prisma.user.findMany({
    where: { createdAt: { gte: date } },
    select: { createdAt: true },
  })
}

module.exports = { findMany, findById, upsert, update, remove, findRegistrationsSince }
