const express = require('express');
const Note = require('../models/Note');

const router = express.Router();



const generateRandomString = (length) => {
    const chars = 'abcefghikmnstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
      randomString += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return randomString;
  };

router.post('/save', async (req, res) => {
    const {userId,title,noteType,content} = req.body;
    console.log(userId,title,noteType,content)
    try {
        const randomString = generateRandomString(4); 
        const noteId = `${userId}_note_${randomString}`;
        console.log(noteId)
        // Find the user's notes by userId
        let userNotes = await Note.findOne({ userId });
    
        const newNote = {
            noteId: noteId,
            title:title,
            type: noteType,
            status: false,
            content: content,
          };

        if (!userNotes) {
            
            const newNoteDoc = new Note({
            userId,
            notes: [newNote], // Add the new note to the notes array
          });
          await newNoteDoc.save();
          res.status(200).send({message:'New note added'})
        } else {
          // If the user exists, check if the note with the same noteId exists
          const existingNote = userNotes.notes.find(note => note.noteId === newNote.noteId);
    
          if (existingNote) {
            // Update the existing note
            existingNote.title = newNote.title;
            existingNote.type = newNote.type;
            existingNote.status = newNote.status;
            existingNote.content = newNote.content;
            existingNote.createdAt = Date.now(); // Optionally update the timestamp
    
            await userNotes.save();
            res.status(200).send({message:'Note updated'})
          } else {
            // If the noteId does not exist, add the new note to the array
            userNotes.notes.push(newNote);
            await userNotes.save();
            res.status(200).send({message:'New note added'})
          }
        }
      } catch (error) {
        console.error('Error saving/updating note:', error);
        throw error;
      }
});

module.exports = router;