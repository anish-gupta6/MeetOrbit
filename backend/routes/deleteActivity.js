const express = require('express');
const {MeetingDetails} = require('../models/User');

const router = express.Router();


router.delete("/deleteActivity/:userId/:activityId", async (req, res) => {
    const {userId,activityId } = req.params;

    try {
        const meetingDetails = await MeetingDetails.findOne({ userId });
    
        if (!meetingDetails) {
          return res.status(404).json({ message: "User not found" });
        }
        
        const meeting = meetingDetails.recentMeetings.some(activity => activity.activityId === activityId);
  
        if(!meeting){
          return res.status(404).json({ message: "meeting not found" });
        }
        const result = await MeetingDetails.updateOne(
          { userId: userId }, 
          { $pull: { recentMeetings: { activityId } } } 
        );
        if (result.modifiedCount > 0) {
        const updatedActivity = await MeetingDetails.findOne({ userId });
        return res.status(200).json({ message: "Meeting deleted successfully", updatedActivity });
        }
        else{
          res.status(404).json({ message: "Error deleting the Meeting !!" });
        }
      } catch (error) {
        console.error("Error fetching Meetings:", error);
        res.status(500).json({ message: "Server error" });
      }
  });
  
  module.exports = router;