function success(res, data = null, statusCode = 200) {
  if (data) {
    return res.status(statusCode).json(data)
  }
  return res.status(statusCode).json({ status: "ok" })
}

function error(res, message = 'an unexpected error occurred', statusCode = 500) {
  return res.status(statusCode).json({
    status: "error",
    message,
  })
}

module.exports = { success, error }
