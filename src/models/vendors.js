// Importing packages
const mongoose = require('mongoose')

// Defining user schema
const vendorsSchema = new mongoose.Schema({
    vendor_name: {
        type: String,
        required: true,
        unique: true
    },
    location: {
        type: {
            type: 'String',
            // default: 'Point',
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    }
}, {
    timestamps: true
})

// 2dsphere index
vendorsSchema.index({ "location": "2dsphere" })

// Defining model
const vendors = mongoose.model('Vendor', vendorsSchema)

// Exporting module
module.exports = vendors