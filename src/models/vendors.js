// Importing packages
const mongoose = require('mongoose')

// Defining user schema
const vendorsSchema = new mongoose.Schema({
    vendor_name: {
        type: String,
        required: true,
        unique: true
    },
    latitude: {
        type: String,
        trim: true,
        required: true,
    },
    longitude: {
        type: String,
        trim: true,
        required: true,
    }
}, {
    timestamps: true
})

// Defining model
const vendors = mongoose.model('Vendor', vendorsSchema)

// Exporting module
module.exports = vendors