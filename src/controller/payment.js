const Razorpay = require('razorpay')

let instance = new Razorpay({
    key_id: process.env.RZR_KEY_ID,
    key_secret: process.env.RZR_KEY_SECRECT
});

// Route for creating order
const createOrder = async (req, res) => {
    let options = {
        amount: req.body.amount,  // amount in the smallest currency unit
        currency: "INR",
        receipt: "order_rcptid_11"
    };
      
    instance.orders.create(options, function(err, order) {
        if (err) {
            res.send(err)
        }
        res.send(order)
        // console.log(order);
    });
}

// Expoting controller functions
module.exports = {
    createOrder
}