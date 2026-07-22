const router = require('express').Router()
const { validate } = require('../middleware/validate')
const { verifyToken, verifyAuthorization, verifyAdminAccess } = require('../middleware/verifyAuth')
const cartController = require('../controllers/cart.controller')
const { cart: cartSchema } = require('../validators')

router.get('/', verifyAdminAccess, cartController.getAllCarts)
router.post('/', verifyToken, validate({ body: cartSchema.new }), cartController.addToCart)
router.post('/clear', verifyToken, cartController.clearCart)
router.get('/:id', verifyAuthorization, cartController.getCart)
router.put('/:id', verifyAuthorization, validate({ body: cartSchema.update }), cartController.updateCart)
router.patch('/:id', verifyAuthorization, validate({ body: cartSchema.patch }), cartController.patchCartItem)
router.delete('/:id', verifyAuthorization, cartController.deleteCart)

module.exports = router
