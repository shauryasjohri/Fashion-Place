const prisma = require('../lib/prisma')

async function findAll() {
  return prisma.category.findMany({ orderBy: { name: 'asc' } })
}

async function findById(id) {
  return prisma.category.findUnique({ where: { id } })
}

async function upsert(name) {
  return prisma.category.upsert({
    where: { name },
    create: { name },
    update: {},
  })
}

async function create(data) {
  return prisma.category.create({ data })
}

async function update(id, data) {
  return prisma.category.update({ where: { id }, data })
}

async function remove(id) {
  return prisma.category.delete({ where: { id } })
}

module.exports = { findAll, findById, upsert, create, update, remove }
