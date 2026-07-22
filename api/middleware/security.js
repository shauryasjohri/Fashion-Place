const helmet = require('helmet')
const compression = require('compression')
const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: "error", message: "too many requests, please try again later" },
})

module.exports = { helmet, compression, limiter }
