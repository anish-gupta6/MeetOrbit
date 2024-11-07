const express = require('express');
const { User, MeetingDetails } = require('../models/User');
const router = express.Router();

router.get('/getUser/:userId', async (req, res) => {
    const { userId } = req.params;
    console.log(userId)

    const user = await User.findOne({ userId });
    // console.log(user)
    if(user){
        const meetingInfo = await MeetingDetails.findOne({userId});
        const userData = { ...user.toObject(), ...meetingInfo.toObject() };
        // console.log(userData)
        return res.status(200).send({ message: 'user found', success: true, userData });
    } else {
        return res.status(404).send({ message: 'user not found', success: false });
    }
});

module.exports = router;
