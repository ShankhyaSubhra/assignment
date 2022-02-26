const axios = require('axios')
const crypto = require('crypto');
const Payment = require('../models/payment')

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

// Route for creating payment link
const createPaymentLink = async (req, res) => {
    try {
        let response = await axios.post('https://api.razorpay.com/v1/payment_links', {
            "amount": req.body.amount,
            "currency": "INR",
            "accept_partial": false,
            "first_min_partial_amount": 100,
            "expire_by": 1691097057,
            "reference_id": req.body.reference_id,
            "description": req.body.description,
            "customer": {
                "name": req.body.name,
                "contact": req.body.contact,
                "email": req.body.email
            },
            "notify": {
                "sms": true,
                "email": true
            },
            "reminder_enable": true,
            "notes": {
                "policy_name": req.body.policy_name
            },
            "callback_url": "https://example-callback-url.com/",
            "callback_method": "get"
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic cnpwX3Rlc3RfZzQ0YTVha0JiSDF2bG46OThiOThzcmtySjNHQThheXFoSWhVemdt'
            }
        })

        let body = {
            "paymentlink_id": response.data.id,
            "order_id": response.data.order_id ? response.data.order_id : null,
            "reference_id": response.data.reference_id,
            "paymentlink_url": response.data.short_url,
            "amount": response.data.amount,
            "status": response.data.status
        }

        const payment = new Payment(body)
        await payment.save()

        res.send(body)

    } catch (e) {
        res.send('Reference Id already exists')
    }   
}

// Route for fetching payment link status
const fetchPaymentLink = async (req, res) => {
    try {
        let response = await axios.get(`https://api.razorpay.com/v1/payment_links/${req.body.id}`,
            { 
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic cnpwX3Rlc3RfZzQ0YTVha0JiSDF2bG46OThiOThzcmtySjNHQThheXFoSWhVemdt'
                } 
            }
        )

        let body = {
            "id": response.data.id,
            "order_id": response.data.order_id ? response.data.order_id : null,
            "reference_id": response.data.reference_id,
            "paymentlink_id": response.data.id,
            "amount": response.data.amount,
            "status": response.data.status
        }

        let body_for_update = {  
            "order_id": response.data.order_id ? response.data.order_id : null,
            "status": response.data.status
        }

        const updates = Object.keys(body_for_update)
        const allowedUpdates = ['order_id', 'status']
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

        if (!isValidOperation) {
            return res.send.status(400).send({ error: 'Invalid updates' })
        }
        
        const payment = await Payment.findOne({ paymentlink_id: body.id })

        if (!payment) {
            return res.status(404).send('Paymentlink_id does not exists')
        }
        
        updates.forEach((update) => payment[update] = body[update])
        await payment.save()
        
        res.send(payment)

    } catch (e) {
        res.send(e)
    }
}

// Expoting controller functions
module.exports = {
    createOrder,
    verifyPaymentSignature,
    createPaymentLink,
    fetchPaymentLink
}