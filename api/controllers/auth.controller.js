const authService = require('../services/auth.service')
const { success, error } = require('../utils/apiResponse')
const asyncHandler = require('../middleware/asyncHandler')

const webhook = asyncHandler(async (req, res) => {
  await authService.handleWebhookEvent(req.body.type, req.body.data)
  return success(res, { status: 'ok' })
})

const provision = asyncHandler(async (req, res) => {
  await authService.provisionUser(req.headers['authorization'], req.body)
  return success(res, { status: 'ok', message: 'user provisioned' })
})

module.exports = { webhook, provision }
