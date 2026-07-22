const express = require('express')
const cors = require('cors')
const { port } = require('./config')
const { helmet, compression, limiter } = require('./middleware/security')
const { handleMalformedJson, globalErrorHandler } = require('./middleware/handleError')
const routes = require('./routes')

const app = express()

app.use(helmet())
app.use(compression())
app.use(limiter)
app.use(cors())
app.use(express.json())
app.use(handleMalformedJson)

app.use(routes)

app.get("/", (req, res) => {
  res.json({ status: "ok" })
})

app.use(globalErrorHandler)

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
