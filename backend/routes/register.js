const express = require('express');
const {User,MeetingDetails} = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');

const router = express.Router();
const salt = 10;
const secretKey = 'zoomClone'


const generateRandomString = (length) => {
    const chars = 'abcefghikmnstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
      randomString += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return randomString;
  };

  const generateMeetingId =()=>{
    const length = 10;
    let meetingId=0;
    const digits = "0123456789";
    for (let i = 0; i < length; i++) {
        meetingId += digits[Math.floor(Math.random() * 10)];
    }
    return meetingId;
  }

  const getRandomColor = () =>{
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

router.post('/register', async (req, res) => {
    const { userName,userEmail,userPassword,profileImg,isGoogleRegister} = req.body;

    try {
        let user = await User.findOne({ userEmail });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        const randomString = generateRandomString(8); 
        const userId = `${userName.toLowerCase().replace(/\s/g, '_')}_${randomString}`;
        const meetingId = generateMeetingId();
        console.log(meetingId)
        const meetingPassword = generateRandomString(6); 
        
        // const hashedMeetingPassword = await bcrypt.hash(meetingPassword, salt);
        const hashedMeetingPassword = CryptoJS.AES.encrypt(meetingPassword, secretKey).toString();
        const colorId = getRandomColor();
        const meetingLink = `http://localhost:3000/meeting/room/s?id=${meetingId}?pwd=${encodeURIComponent(hashedMeetingPassword)}`
        
        // const googleId = await bcrypt.hash(userPassword, salt);
        const googleId = CryptoJS.AES.encrypt(userPassword, secretKey).toString();
       if(isGoogleRegister){
            
            user = new User({
                googleId,
                userId,
                userName,
                userEmail,
                userPassword:'',
                profileImg,
                colorId
            });
       }
       else{
            user = new User({
                googleId:'',
                userId,
                userName,
                userEmail,
                userPassword:googleId,
                profileImg,
                colorId
            });
       }
        

        const meeting= new MeetingDetails({
            userId,
            meetingName:userName,
            meetingId,
            meetingPassword,
            meetingLink,
            meetingRecordings:[],
            recentMeetings:[],
            scheduledMeetings:[]
        })
        console.log(userId,
            userName,
            userEmail,
            userPassword,
            profileImg);

        console.log(userId,
            meetingId,
            meetingPassword,
            meetingLink);

        await user.save();
        await meeting.save();

        res.status(200).send({message:'success'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
