// Importing modules
const User = require('../models/user')

// Function for user signup
const signup = async (req, res) => {
    const user = new User(req.body)

    try{
        await user.save()
        const token = await user.generateAuthToken()

        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send('User already exists')
    }
}

// Function for user login
const login = async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()

        res.send({ user, token })
    } catch (e) {
        res.status(400).send('Cannot login. User does not exist')
    }
}

// Function to fetch user own profile
const userInfo = async (req, res) => {
    res.send(req.user)
}

// Expoting controller functions
module.exports = {
    signup,
    login,
    userInfo
}