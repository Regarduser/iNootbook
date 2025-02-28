const connectToMongo = require("./db");
const express = require('express');
const ServerlessHttp = require('serverless-http')
var cors = require('cors');
connectToMongo();
const app = express()
const port = 5000


app.use(cors())
app.use(express.json())
app.use('/api/auth', require('./routes/auth'))
app.use('/api/note', require('./routes/note'))

app.listen(port, () => {
  console.log(`iNootbook backend is running on port ${port}`)
})

module.exports.handler = ServerlessHttp(app)