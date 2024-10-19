const express = require('express');
const router = express.Router();
const MeetingRoom = require('../models/MeetingRoom');

router.post('/join-room', async (req, res) => {
    try {
      const {meetingId, meetingPassword} = req.body;
      console.log(meetingId, meetingPassword)
      let room = await MeetingRoom.findOne({roomId:meetingId});
      if(room){
        if(room.roomPassword === meetingPassword){
            res.status(200).send({ message: 'Joined Meeting !!',found:true,success:true });
        }
        else{
            res.status(400).send({ message: 'Wrong Password !!',success:false });
        }
      }
      else{
        res.status(400).send({ message: 'Meeting not started !!',found:false,success:false });
      }

    } catch (error) {
      console.error('Error creating meeting room:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  module.exports = router;