const express = require('express');
const router = express.Router();
const cors = require('cors');
const {SendOTPMail} = require('../models/SendOTPMail');
const {User} = require('../models/User');

// const app = express();

// // Use CORS middleware
// app.use(cors());

router.post('/generateOTP', async (req, res) => {
    const { userName, userEmail } = req.body;
    // console.log(userName, userEmail);
    let user = await User.findOne({ userEmail });
        if (user) {
            return res.status(400).send({ message: 'User already exists' });
        }
    const digits = '0123456789';
    let otp = '';
    const length =6;
    for (let i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }

    SendOTPMail(userEmail,otp);
    console.log(otp)
    res.status(200).send({otp:otp , message:'OTP sent Successfully !!!'});

});
module.exports = router;