const { ApiError } = require('../utils/errors')

const handleMalformedJson = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).send({ 
      status: "error", 
      message: err.message,
    })
  }
  next()
}

const globalErrorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    })
  }

  console.error('Unhandled error:', err)
  return res.status(500).json({
    status: "error",
    message: "an unexpected error occurred",
  })
}

module.exports = {
  handleMalformedJson,
  globalErrorHandler,
}
