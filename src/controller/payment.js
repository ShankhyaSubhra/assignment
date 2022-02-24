const Razorpay = require('razorpay')
const axios = require('axios')
const crypto = require('crypto');

let instance = new Razorpay({
    key_id: process.env.RZR_KEY_ID,
    key_secret: process.env.RZR_KEY_SECRECT
});

// Route for creating order
const createOrder = async (req, res) => {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Basic cnpwX3Rlc3RfZzQ0YTVha0JiSDF2bG46OThiOThzcmtySjNHQThheXFoSWhVemdt'
    }

    axios.post('https://api.razorpay.com/v1/orders', {
        "amount": req.body.amount,
        "currency": "INR",
        "receipt": req.body.receipt
    },
    {
        headers: headers
    })
    .then(function (response) {
        console.log(response.data)
        res.send(response.data)
    })
    .catch(function (error) {
        res.send(error)
    });
}

// Route for verifying payment signature
const verifyPaymentSignature = async (req, res) => {
    try {
        let body = req.body.order_id + "|" + req.body.razorpay_payment_id
    
        let generated_signature = crypto.createHmac('sha256', process.env.RZR_KEY_SECRECT).update(body.toString()).digest('hex')
        
        if (generated_signature == req.body.razorpay_signature) {
            res.send('Payment successful')
        } else {
            res.send('Payment unsuccessful')
        }
    } catch (e) {
        res.send(e)
    }
    
}

// Expoting controller functions
module.exports = {
    createOrder,
    verifyPaymentSignature
}