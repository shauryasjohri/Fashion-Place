const router = require('express').Router()
const { verifyToken } = require('../middleware/verifyAuth')
const checkoutController = require('../controllers/checkout.controller')

router.post('/order', verifyToken, checkoutController.createOrder)
router.post('/verify', verifyToken, checkoutController.verifyPayment)

module.exports = router
