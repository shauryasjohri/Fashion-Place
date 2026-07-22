const { verifyToken } = require('@clerk/clerk-sdk-node')
const userRepository = require('../repositories/user.repository')
const { BadRequestError, UnauthorizedError } = require('../utils/errors')

function extractToken(header) {
  if (!header) return null
  return header.startsWith('Bearer ') ? header.slice(7) : header
}

async function handleWebhookEvent(type, data) {
  if (type === 'user.created' || type === 'user.updated') {
    const clerkId = data.id
    const email = data.email_addresses?.[0]?.email_address || ''
    const fullname = `${data.first_name || ''} ${data.last_name || ''}`.trim() || email
    await userRepository.upsert(clerkId, { fullname, email })
  }

  if (type === 'user.deleted') {
    try {
      await userRepository.remove(data.id)
    } catch (_) { /* user may not exist */ }
  }
}

async function provisionUser(authHeader, body) {
  const token = extractToken(authHeader)
  if (!token) throw new UnauthorizedError('access token not found')

  let payload
  try {
    payload = await verifyToken(token)
  } catch (_) {
    throw new UnauthorizedError('access token is invalid')
  }

  if (!payload || !payload.sub) throw new UnauthorizedError('access token is invalid')

  const { fullname, email } = body
  if (!fullname || !email) throw new BadRequestError('fullname and email are required')

  await userRepository.upsert(payload.sub, { fullname, email })
  return { message: 'user provisioned' }
}

module.exports = { handleWebhookEvent, provisionUser }
