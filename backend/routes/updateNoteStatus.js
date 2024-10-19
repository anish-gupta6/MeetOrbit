const express = require('express');
const Note = require('../models/Note');

const router = express.Router();


router.post('/updateNoteStatus', async (req, res) => {
    const { userId, noteId } = req.body; // Extract userId and noteId from the request body
  
    try {
        // Find the user by userId
        const userNotes = await Note.findOne({ userId });
    
        if (!userNotes) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        // Find the specific note in the user's notes array
        let note = userNotes.notes.find(note => note.noteId === noteId);
    
        if (!note) {
          return res.status(404).json({ message: 'Note not found' });
        }
    
        // Example: Toggle the status of the note
        note.status = !note.status; // Change this logic based on your application's requirements
    
        // Save the updated user document
        await userNotes.save();
        note = userNotes.notes.find(note => note.noteId === noteId);
        res.status(200).json({ message: `Marked as ${note.status?'completed':'pending'}`});
    
      } catch (err) {
        console.error('Error updating note status:', err);
        res.status(500).json({ message: 'Server error' });
      }
  });
  
  module.exports = router;