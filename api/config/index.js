const dotenv = require('dotenv')
dotenv.config()

const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  database: {
    url: process.env.DATABASE_URL,
  },
  clerk: {
    secretKey: process.env.CLERK_SECRET_KEY,
  },
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_KEY_SECRET,
  },
}

module.exports = config
