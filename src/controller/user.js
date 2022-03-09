// Importing modules
const crypto = require('crypto');
const User = require('../models/user')

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const smsKey = process.env.SMS_SECRET_KEY;
const twilioNum = process.env.TWILIO_PHONE_NUMBER;

// Function for user signup
const sendOtp = async (req, res) => {
    try {
        const phone = req.body.phone;
        const otp = Math.floor(100000 + Math.random() * 900000);
        const ttl = 2 * 60 * 1000;
        const expires = Date.now() + ttl;
        const data = `${phone}.${otp}.${expires}`;
        const hash = crypto.createHmac('sha256', smsKey).update(data).digest('hex');
        const fullHash = `${hash}.${expires}`;
    
        client.messages.create({
			body: `Your One Time Login Password For CFM is ${otp}`,
			from: twilioNum,
			to: phone
		})
		.then((messages) => console.log(messages))
		.catch((err) => console.error(err));

        // res.status(200).send({ phone, hash: fullHash, otp });  // this bypass otp via api only for development instead hitting twilio api all the time
        res.status(200).send({ phone, hash: fullHash });
    } catch (e) {
        res.status(400).send('error sending otp');
    }
}

// Function for verifying user signup otp
const signup = async (req, res) => {
    try{
        const phone = req.body.phone;
        const hash = req.body.hash;
        const otp = req.body.otp;
        let [ hashValue, expires ] = hash.split('.');

        let now = Date.now();
        if (now > parseInt(expires)) {
            return res.status(504).send({ msg: 'Timeout. Please try again' });
        }
        let data = `${phone}.${otp}.${expires}`;
        let newCalculatedHash = crypto.createHmac('sha256', smsKey).update(data).digest('hex');
        if (newCalculatedHash === hashValue) {
            const user = new User(req.body)
            await user.save()
            const token = await user.generateAuthToken()

            res.status(201).send({ user, token })
        } else {
            res.status(400).send('Incorrect OTP')
        }
    } catch (e) {
        res.status(400).send('User already exists')
    }
}

// Function for user login
const login = async (req, res) => {
    try {
        const phone = req.body.phone;
        const hash = req.body.hash;
        const otp = req.body.otp;
        let [ hashValue, expires ] = hash.split('.');

        let now = Date.now();
        if (now > parseInt(expires)) {
            return res.status(504).send({ msg: 'Timeout. Please try again' });
        }
        let data = `${phone}.${otp}.${expires}`;
        let newCalculatedHash = crypto.createHmac('sha256', smsKey).update(data).digest('hex');
        if (newCalculatedHash === hashValue) {
            const user = await User.findByCredentials(req.body.email, req.body.password)
            const token = await user.generateAuthToken()

            res.send({ user, token })
        } else {
            res.status(400).send('Incorrect OTP')
        }
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
    sendOtp,
    signup,
    login,
    userInfo
}