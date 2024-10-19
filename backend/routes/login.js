const express = require('express');
const { User, MeetingDetails } = require('../models/User');
const bcrypt = require('bcryptjs');
const CryptoJS = require('crypto-js');
const salt = 10;
const router = express.Router();

router.post('/login', async (req, res) => {
    const { userEmail, userPassword, profileImg, isGoogleLogin } = req.body;
    console.log(userEmail, userPassword, profileImg, isGoogleLogin);

    let user = await User.findOne({ userEmail });
    const secretKey = 'zoomClone';

    if (!user) {
        console.log('adfad')
        return res.status(404).send({ message: 'Login Failed! Incorrect Credentials', success: false });
    }

    if (isGoogleLogin) {
        // const bytes = CryptoJS.AES.decrypt(userPassword, secretKey);
        // const decUserPassword = bytes.toString(CryptoJS.enc.Utf8);

        if (!user.googleId) {
            // If it's a new Google login, store the Google ID securely
            await User.updateOne({ userId: user.userId }, { $set: { googleId: CryptoJS.AES.encrypt(userPassword, secretKey).toString() } });
        }

        await User.updateOne({ userId: user.userId }, { $set: { profileImg: profileImg } });

        console.log(user.googleId)
        const bytes = CryptoJS.AES.decrypt(user.googleId, secretKey);
        const decUserPassword = bytes.toString(CryptoJS.enc.Utf8);
        console.log(decUserPassword)
        if (decUserPassword === userPassword) {
            // Handle successful Google login
            const userInfo = await User.findOne({ userEmail });
            const meetingInfo = await MeetingDetails.findOne({ userId: user.userId });
            const userData = { ...userInfo.toObject(), ...meetingInfo.toObject() };
            console.log(userData)
            return res.status(200).send({ message: 'Login Successful', success: true, userData });
        } else {
            console.log('none')
            return res.status(404).send({ message: 'Google Login Failed', success: false });
        }
    } else {
        const bytes = CryptoJS.AES.decrypt(user.userPassword, secretKey);
        const decUserPassword = bytes.toString(CryptoJS.enc.Utf8);

        if (decUserPassword === userPassword) {
            // Handle successful Google login
            const userInfo = await User.findOne({ userEmail });
            const meetingInfo = await MeetingDetails.findOne({ userId: user.userId });
            const userData = { ...userInfo.toObject(), ...meetingInfo.toObject() };
            console.log(userData)
            return res.status(200).send({ message: 'Login Successful', success: true, userData });
        } else {
            console.log('err')
            return res.status(404).send({ message: 'Google Login Failed', success: false });
        }
    }
});

module.exports = router;
