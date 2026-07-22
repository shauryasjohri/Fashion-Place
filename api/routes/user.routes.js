const router = require('express').Router()
const { validate } = require('../middleware/validate')
const { verifyToken, verifyAuthorization, verifyAdminAccess } = require('../middleware/verifyAuth')
const userController = require('../controllers/user.controller')
const { user: userSchema } = require('../validators')

router.get('/', verifyAdminAccess, validate({ query: userSchema.query }), userController.listUsers)
router.get('/me', verifyToken, userController.getMe)
router.put('/:id', verifyAuthorization, validate({ body: userSchema.update }), userController.updateUser)
router.delete('/:id', verifyAuthorization, userController.deleteUser)
router.get('/stats', verifyAdminAccess, userController.getStats)
router.get('/:id', verifyAdminAccess, userController.getUserById)

module.exports = router
