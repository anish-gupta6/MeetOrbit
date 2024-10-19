const mongoose = require("mongoose");

const noteArrSchema = new mongoose.Schema({
  noteId: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const noteSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  notes: [noteArrSchema],
});

const Note = mongoose.model('Note', noteSchema, 'notes');
module.exports = Note;
