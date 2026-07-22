const router = require('express').Router()

router.use('/auth', require('./auth.routes'))
router.use('/users', require('./user.routes'))
router.use('/products', require('./product.routes'))
router.use('/carts', require('./cart.routes'))
router.use('/checkout', require('./checkout.routes'))
router.use('/orders', require('./order.routes'))
router.use('/categories', require('./category.routes'))

module.exports = router
