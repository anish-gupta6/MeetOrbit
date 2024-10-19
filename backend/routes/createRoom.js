const express = require('express');
const router = express.Router();
const MeetingRoom = require('../models/MeetingRoom');

router.post('/create-room', async (req, res) => {
    try {
        const { meetingId, meetingPassword} = req.body;
        console.log(meetingId, meetingPassword)
        
        let room = await MeetingRoom.findOne({roomId:meetingId})

        if(room){
            return res.status(400).json({ message: 'Meeting Room already exists !!',success:false });
        }

      
      room = new MeetingRoom({
        roomId:meetingId,
        roomPassword:meetingPassword,
        participants:[],
        chat:[]
      });
  
      await room.save(); // Save the meeting room in the database
  
      res.status(200).json({ message: 'Meeting Room created successfully !!',success:true });

    } catch (error) {
      console.error('Error creating meeting room:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  module.exports = router;