const mongoose = require('mongoose');

// Schema for a single chat message
const chatSchema = new mongoose.Schema({
  sender: { type: String, required: true }, 
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

// Schema for a participant
const participantSchema = new mongoose.Schema({
  userId: { type: String, required: true }, 
  userName: { type: String, required: true },
  joinedAt: { type: Date, default: Date.now },
  isHost: { type: Boolean, default: false } 
});

// Main Meeting Room Schema
const meetingRoomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true }, 
  roomPassword: { type: String, required: true }, 
  participants: [participantSchema], 
  chat: [chatSchema], 
  createdAt: { type: Date, default: Date.now } 
});

const MeetingRoom = mongoose.model('MeetingRoom', meetingRoomSchema,'rooms');

module.exports = MeetingRoom;
