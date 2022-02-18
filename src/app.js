// Importing packages
const express = require('express')
require('./db/mongoose')
const userRoutes = require('./routes/user')
const paymentRoutes = require('./routes/payment')

// Starting express application
const app = express()

app.use(express.json())

// Setting up routes to use
app.use('/', userRoutes)
app.use('/', paymentRoutes)

// Exporting module
module.exports = app