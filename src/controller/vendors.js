const Vendors = require('../models/vendors')

// Route for adding vendors
const addVendors = async (req, res) => {
    const vendor = new Vendors(req.body)

    try{
        await vendor.save()

        res.status(201).send({ vendor })
    } catch (e) {
        res.status(400).send('Vendor alredy exists')
    }
}

// Route for getting vendors within 5km
const getVendors = async (req, res) => {
    try {
        // Converts numeric degrees to radians
        const toRad = (Value) => {
            return Value * Math.PI / 180;
        }
        
        //This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
        const calcCrow = (lat1, lon1, lat2, lon2) => {
            let R = 6371; // km
            let dLat = toRad(lat2-lat1);
            let dLon = toRad(lon2-lon1);
            lat1 = toRad(lat1);
            lat2 = toRad(lat2);

            let a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
            var d = R * c;
            return d;
        }

        let latitude = req.body.latitude
        let longitude = req.body.longitude
        let vendorsArray = []

        const cursor = await Vendors.find({});
        await cursor.forEach(doc => {
            let distance = calcCrow(doc.latitude, doc.longitude, latitude, longitude).toFixed(1)
            if(distance < 5) {
                vendorsArray.push(doc.vendor_name)
            }
            
        });

        res.status(200).send({vendorsArray})
    } catch (e) {
        res.status(400).send(e)
    }
}

// Expoting controller functions
module.exports = {
    addVendors,
    getVendors
}