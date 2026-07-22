const router = require('express').Router()
const { validate } = require('../middleware/validate')
const { verifyAdminAccess } = require('../middleware/verifyAuth')
const productController = require('../controllers/product.controller')
const { product: productSchema } = require('../validators')

router.get('/', validate({ query: productSchema.query }), productController.listProducts)
router.post('/', verifyAdminAccess, validate({ body: productSchema.new }), productController.createProduct)
router.put('/:id', verifyAdminAccess, validate({ body: productSchema.update }), productController.updateProduct)
router.delete('/:id', verifyAdminAccess, productController.deleteProduct)
router.get('/:id', productController.getProductById)

module.exports = router
