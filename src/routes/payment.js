// Importing packages
const express = require('express')
const paymentController = require('../controller/payment')

// Initializing express router
const router = new express.Router()

// Route for user signup
router.post('/createorder', paymentController.createOrder)

//Route for verifying payment signature
router.post('/verifypaymentsignature', paymentController.verifyPaymentSignature)

//Route for creating payment link
router.post('/createpaymentlink', paymentController.createPaymentLink)

//Route for fetching payment link
router.post('/fetchpaymentlink', paymentController.fetchPaymentLink)

// Exporting express router
module.exports = router