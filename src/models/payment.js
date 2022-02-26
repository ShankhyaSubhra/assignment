// Importing packages
const mongoose = require('mongoose')

// Defining user schema
const paymentSchema = new mongoose.Schema({
    paymentlink_id: {
        type: String,
        required: true,
        trim: true
    },
    order_id: {
        type: String,
        trim: true,
    },
    reference_id: {
        type: String,
        trim: true,
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
})

// Defining model
const Payment = mongoose.model('Payment', paymentSchema)

// Exporting module
module.exports = Payment