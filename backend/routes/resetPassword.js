const express = require('express');
const {User} = require('../models/User');
const bcrypt = require('bcryptjs');

const router = express.Router();
const salt = 10;

router.post('/resetPassword', async (req, res) => {
    const {userEmail,userPassword} = req.body;
    console.log(userEmail,userPassword)
    try {
        const hashed=await bcrypt.hash(userPassword, salt)
        let user = await User.findOne({ userEmail });
        if (user) {
            await User.updateOne({userEmail},{$set:{userPassword:hashed}});
            res.status(200).send({message:'Password reset successful !!'})
        }
        else{
            res.status(400).send({message:'Password reset error !!'})
        }
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;