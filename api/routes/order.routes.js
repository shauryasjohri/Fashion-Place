const router = require('express').Router()
const { validate } = require('../middleware/validate')
const { verifyToken, verifyAuthorization, verifyAdminAccess } = require('../middleware/verifyAuth')
const orderController = require('../controllers/order.controller')
const { order: orderSchema } = require('../validators')

router.get('/', verifyAdminAccess, validate({ query: orderSchema.query }), orderController.listOrders)
router.post('/', verifyToken, validate({ body: orderSchema.new }), orderController.createOrder)
router.get('/stats', verifyAdminAccess, orderController.getStats)
router.get('/:id', verifyToken, orderController.getOrder)
router.put('/:id', verifyAdminAccess, validate({ body: orderSchema.update }), orderController.updateOrder)
router.delete('/:id', verifyAdminAccess, orderController.deleteOrder)
router.get('/user/:id', verifyAuthorization, orderController.getUserOrders)

module.exports = router
