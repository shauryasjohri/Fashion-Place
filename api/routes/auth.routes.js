const router = require('express').Router()
const authController = require('../controllers/auth.controller')
const { validate } = require('../middleware/validate')
const { auth: authSchema } = require('../validators')

router.post('/webhook', authController.webhook)
router.post('/provision', validate({ body: authSchema.register }), authController.provision)

module.exports = router
