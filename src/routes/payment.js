// Importing packages
const express = require('express')
const paymentController = require('../controller/payment')

// Initializing express router
const router = new express.Router()

// Route for user signup
router.post('/createorder', paymentController.createOrder)

//Route for verifying payment signature
router.post('/verifypaymentsignature', paymentController.verifyPaymentSignature)

// Exporting express router
module.exports = router