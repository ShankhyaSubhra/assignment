// Importing packages
const express = require('express')
const auth = require('../middleware/auth')
const userController = require('../controller/user')

// Initializing express router
const router = new express.Router()

// Route for test
router.get('/', (req, res) => {
    res.send('test')
})

// Route for user signup
router.post('/users/sendotp', userController.sendOtp)

// Route for user signup
router.post('/users/signup', userController.signup)

// Route for user login
router.post('/users/login', userController.login)

// Route to fetch user own profile
router.get('/users/me', auth, userController.userInfo)

// Exporting express router
module.exports = router