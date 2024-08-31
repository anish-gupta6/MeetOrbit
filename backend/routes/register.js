const express = require('express');
const {User,MeetingDetails} = require('../models/User');
// const MeetingDetails = require('../models/MeetingDetails');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

// const encryptPassword = async (value) =>{
//     const salt = 10;
//     const encryptedPassword = await bcrypt.hash(value, salt);
//     return encryptedPassword;
// }


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

router.post('/register', async (req, res) => {
    const { userName,userEmail,userPassword,profileImg,isGoogleRegister} = req.body;

    try {
        let user = await User.findOne({ userEmail });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        // let user;
        const randomString = generateRandomString(8); 
        const userId = `${userName.toLowerCase().replace(/\s/g, '_')}@${randomString}`;
        const meetingId = generateMeetingId();
        console.log(meetingId)
        const meetingPassword = generateRandomString(6); 
        const salt = 10;
        const hashedMeetingPassword = await bcrypt.hash(meetingPassword, salt);
        const meetingLink = `http://localhost:3000/j/${meetingId}?pwd=${hashedMeetingPassword}`
        
       if(isGoogleRegister){
        const googleId = await bcrypt.hash(userPassword, salt);
            
            user = new User({
                googleId,
                userId,
                userName,
                userEmail,
                userPassword:'',
                profileImg,
            });
            // console.log('123')
       }
       else{
            // const googleId = '';
            user = new User({
                googleId:'',
                userId,
                userName,
                userEmail,
                userPassword:await bcrypt.hash(userPassword, salt),
                profileImg,
            });
       }
        

        const meeting= new MeetingDetails({
            userId,
            meetingId,
            meetingPassword,
            meetingLink,
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
