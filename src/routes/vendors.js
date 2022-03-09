// Importing packages
const express = require('express')
const vendorsController = require('../controller/vendors')

// Initializing express router
const router = new express.Router()

// Route for adding vendors
router.post('/addvendors', vendorsController.addVendors)

// Route for user signup
router.get('/getvendors', vendorsController.getVendors)

// Exporting express router
module.exports = router