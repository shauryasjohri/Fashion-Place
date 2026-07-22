const { ZodError } = require('zod')

function validate(schema) {
  return (req, res, next) => {
    try {
      if (schema.body) req.body = schema.body.parse(req.body)
      if (schema.query) req.query = schema.query.parse(req.query)
      if (schema.params) req.params = schema.params.parse(req.params)
      next()
    } catch (err) {
      if (err instanceof ZodError) {
        const first = err.issues[0]
        return res.status(400).json({
          status: 'error',
          message: first.message,
          params: first.path,
        })
      }
      next(err)
    }
  }
}

module.exports = { validate }
