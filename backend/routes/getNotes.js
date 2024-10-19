const express = require('express');
const Note = require('../models/Note');

const router = express.Router();


// Route to fetch notes based on userId and filter by status
router.get("/fetch/:userId/:status", async (req, res) => {
    const { userId, status } = req.params;
  
    try {
      const userNotes = await Note.findOne({ userId });
  
      if (!userNotes) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Filter notes based on the activeTab (status)
      let filteredNotes;
      if (status === "Completed") {
        filteredNotes = userNotes.notes.filter(note => note.status === true); 
      } else if(status === "Pending"){
        filteredNotes = userNotes.notes.filter(note => note.status === false);
      }
      else{
        filteredNotes = userNotes.notes;
      }

      console.log(filteredNotes)
  
      res.status(200).json({ notes: filteredNotes });
    } catch (error) {
      console.error("Error fetching notes:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  module.exports = router;