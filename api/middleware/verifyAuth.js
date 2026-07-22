const { verifyToken: clerkVerify } = require('@clerk/clerk-sdk-node')
const userRepository = require('../repositories/user.repository')

function extractToken(req) {
  const header = req.headers['authorization']
  if (!header) return null
  return header.startsWith('Bearer ') ? header.slice(7) : header
}

async function runClerkAuth(req, res, next) {
  const token = extractToken(req)
  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "access token not found",
    })
  }

  let payload
  try {
    payload = await clerkVerify(token, { secretKey: process.env.CLERK_SECRET_KEY })
  } catch (err) {
    return res.status(403).json({
      status: "error",
      message: "access token is invalid",
    })
  }

  if (!payload || !payload.sub) {
    return res.status(403).json({
      status: "error",
      message: "access token is invalid",
    })
  }

  req.auth = { userId: payload.sub }
  next()
}

async function attachUser(req, res, next) {
  try {
    const user = await userRepository.upsert(req.auth.userId, {
      fullname: "User",
      email: `${req.auth.userId}@user.local`,
    })
    req.user = { uid: user.id, isAdmin: user.isAdmin }
    next()
  } catch (err) {
    console.error(err)
    return res.status(500).json({
      status: "error",
      message: "an unexpected error occurred",
    })
  }
}

const verifyToken = (req, res, next) => {
  runClerkAuth(req, res, () => {
    attachUser(req, res, next)
  })
}

const verifyAuthorization = (req, res, next) => {
  runClerkAuth(req, res, () => {
    attachUser(req, res, () => {
      if (req.user.uid === req.params.id || req.user.isAdmin) {
        next()
      } else {
        res.status(403).json({
          status: "error",
          message: "you are not authorized to perform this action",
        })
      }
    })
  })
}

const verifyAdminAccess = (req, res, next) => {
  runClerkAuth(req, res, () => {
    attachUser(req, res, () => {
      if (req.user.isAdmin) {
        next()
      } else {
        res.status(403).json({
          status: "error",
          message: "you are not authorized to perform this action",
        })
      }
    })
  })
}

module.exports = {
  verifyToken,
  verifyAuthorization,
  verifyAdminAccess,
}
