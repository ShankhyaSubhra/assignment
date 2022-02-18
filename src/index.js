// Importing packages
const app = require('./app')

// Initializing port no. from env varible
const port = process.env.PORT

// Running the app
app.listen(port, () => {
    console.log('Server is up on port ' + process.env.PORT)
})