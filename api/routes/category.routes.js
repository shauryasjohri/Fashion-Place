const router = require('express').Router()
const { validate } = require('../middleware/validate')
const { verifyAdminAccess } = require('../middleware/verifyAuth')
const categoryController = require('../controllers/category.controller')
const { category: categorySchema } = require('../validators')

router.get('/', categoryController.listCategories)
router.post('/', verifyAdminAccess, validate({ body: categorySchema.create }), categoryController.createCategory)
router.put('/:id', verifyAdminAccess, validate({ body: categorySchema.update }), categoryController.updateCategory)
router.delete('/:id', verifyAdminAccess, categoryController.deleteCategory)

module.exports = router
