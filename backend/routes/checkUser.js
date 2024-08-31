const express = require('express');
const {User} = require('../models/User');


const router = express.Router();

router.post('/checkUser',async (req,res)=>{
    const {userEmail} = req.body;
    
        let user = await User.findOne({ userEmail });
        if (user) {
            return res.status(200).send({success:true});
        } 
        else {
            return res.status(404).send({success:false});
        }
})

module.exports = router;