const express = require('express');
const {User,MeetingDetails} = require('../models/User');
// const MeetingDetails = require('../models/MeetingDetails');
const bcrypt = require('bcryptjs');
const salt = 10;
const router = express.Router();

router.post('/login', async (req,res)=>{
    const {userEmail,userPassword,isGoogleLogin}=req.body;
    let user = await User.findOne({ userEmail });
        if (user) {
            
            // console.log(meetingInfo)
            if(isGoogleLogin){
                if(user.googleId===''){
                    await User.updateOne({ userId:user.userId },  // Filter criteria
                        { $set: { googleId: await bcrypt.hash(userPassword, salt) } } )
                }

                if (user) {
           bcrypt.compare(userPassword,user.googleId, async (err,result)=>{
            let meetingInfo = await MeetingDetails.findOne({userId:user.userId});
            if(err){
                console.log('error comparing passwords !!');
            }
            else if(result){
                const UserInfo = {
                    ...user.toObject(),  // Convert Mongoose document to plain object
                    ...meetingInfo.toObject() // Add meetingInfo to the combined object
                };
                // console.log(UserInfo)
                // console.log('Raja')
                res.status(200).send({message:'Login Successful',success:true,userData:UserInfo})
            }
            else{
                res.status(404).send({message:'Login Failed',success:false})
            }
           }) 
                }
        }
        else{
            bcrypt.compare(userPassword,user.userPassword, (err,result)=>{
                if(err){
                    console.log('error comparing passwords !!');
                }
                else if(result){
                    const UserInfo = {
                        ...user.toObject(),  // Convert Mongoose document to plain object
                        ...meetingInfo.toObject() // Add meetingInfo to the combined object
                    };
                    // console.log(UserInfo)
                    res.status(200).send({message:'Login Successful',success:true,userData:UserInfo})
                }
                else{
                    res.status(404).send({message:'Login Failed! Incorrect Credentials',success:false})
                }
               }) 
        }


        }
})

module.exports = router;