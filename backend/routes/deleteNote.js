const express = require('express');
const Note = require('../models/Note');

const router = express.Router();


// Route to fetch notes based on userId and filter by status
router.delete("/deleteNote", async (req, res) => {
    const { userId, noteId } = req.body;
  
    try {
      const userNotes = await Note.findOne({ userId });
  
      if (!userNotes) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const note = userNotes.notes.some(note => note.noteId === noteId);

      if(!note){
        return res.status(404).json({ message: "Note not found" });
      }
      const result = await Note.updateOne(
        { userId: userId }, // Match the user
        { $pull: { notes: { noteId: noteId } } } // Pull the note with matching noteId
      );
      if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Note deleted Successfully !!" });
      }
      else{
        res.status(404).json({ message: "Error deleting the note !!" });
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  module.exports = router;