const Vendors = require('../models/vendors')

// Route for adding vendors
const addVendors = async (req, res) => {
    // const vendor = new Vendors(req.body)

    try{
        const locationData = {
            vendor_name: req.body.vendor_name,
            location: {
                type: "Point",
                coordinates: [req.body.longitude, req.body.latitude]
            }
        }
        const vendor = new Vendors(locationData)
        await vendor.save()

        res.status(201).send({ vendor })
    } catch (e) {
        res.status(400).send(e)
    }
}

// Route for getting vendors within 5km
const getVendors = async (req, res) => {
    try {
        Vendors.find({
            location: {
                $geoWithin: {
                    $centerSphere: [ [req.body.longitude, req.body.latitude],  3.10686 / 3963.2 ]
                }
            }
           })
           .find((error, results) => {
                if (error) {
                    return res.status(400).send(error)
                }
                res.status(200).send({results})
           })
    } catch (e) {
        res.status(400).send(e)
    }
}

// Expoting controller functions
module.exports = {
    addVendors,
    getVendors
}