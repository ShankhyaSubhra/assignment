// Importing packages
const express = require('express')
const paymentController = require('../controller/payment')

// Initializing express router
const router = new express.Router()

// Route for user signup
router.post('/createorder', paymentController.createOrder)

// Exporting express router
module.exports = router