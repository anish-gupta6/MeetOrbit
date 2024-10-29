const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { ExpressPeerServer } = require('peer');
const {MeetingDetails} = require('./models/User');

dotenv.config();
const port = process.env.PORT || 3001;

// Initialize express app
const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
.catch(err => console.error(err));

// Create an HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Set up PeerJS server
const peerServer = ExpressPeerServer(server, {
  debug: true,
  // path:'/'
});

// Serve PeerJS on '/peerjs'
app.use('/peerjs', peerServer);

// Manage meeting rooms and their users
let meetingRooms = {};
let roomChats = {};
let roomDeletionTimers = {};  // Store timers for rooms with no participants


// Route to create a room
app.post('/meeting/create-room', (req, res) => {
  const { meetingId, meetingPassword, meetingTitle, userId,userName } = req.body;
  console.log(meetingId, meetingPassword, userId,userName)
  if(!meetingRooms[meetingId]){
  meetingRooms[meetingId] = {title:meetingTitle, meetingPassword: meetingPassword, participants: [],isScreenSharing:false,screenSharer:'', startTime:new Date(Date.now()), endTime:'', createdBy: {userId,userName} };
  roomChats[meetingId] = [];
  console.log('Room created',meetingId)
  console.log(meetingRooms[meetingId].startTime)
  res.status(200).send({ message: 'Room created' });
  }
  else{
    console.log('Room exist',meetingId)
    res.status(401).send({ message: 'Room already exists !' });
  }

});

// Route to join a room
app.post('/meeting/join-room', (req, res) => {
  const { meetingId, meetingPassword } = req.body;
  const room = meetingRooms[meetingId];
  if (room && room.meetingPassword === meetingPassword) {
    res.status(200).send({ message: 'Joined room' });
  } else {
    res.status(401).send({ message: 'Invalid meeting ID or password' });
  }
});

app.get('/meeting/:meetingId/chat', (req, res) => {
  const { meetingId } = req.params;
  const chatHistory = roomChats[meetingId] || [];
  res.status(200).json({ chatHistory });
});

app.get('/meeting/:meetingId/participants', (req, res) => {
  const { meetingId } = req.params;
  const participants = meetingRooms[meetingId].participants || [];
  res.status(200).json({ participants });
});

app.get('/getMeetingInfo/:meetingId', (req, res) => {
  const { meetingId } = req.params;
  const meetingInfo = meetingRooms[meetingId] || {};
  res.status(200).json({ meetingInfo });
});

const saveMeeting = async (room,meetingId,lastTime) =>{
  const userId = room.createdBy.userId;
  const title = room.title;
  const startTime = room.startTime;
  const endTime = lastTime;
  const duration = (endTime - startTime)/1000;

  const recentMeeting = {
    title,
    startTime,
    endTime,
    duration
};
console.log(recentMeeting)
  try {
    await MeetingDetails.findOneAndUpdate(
        { userId,meetingId }, 
        { $push: { recentMeetings: recentMeeting } },
        { new: true } 
    );
    console.log('Recent meeting added successfully');
} catch (error) {
    console.error('Error updating recent meetings:', error);
}
}

// Function to check and delete a room if no participants
const scheduleRoomDeletion = (meetingId) => {

  if (roomDeletionTimers[meetingId]) {
    return; // Timer already exists, no need to create a new one
  }
  
  roomDeletionTimers[meetingId] = setTimeout(async () => {
    const room=meetingRooms[meetingId];
    if (room && room.participants.length === 0) {
      delete meetingRooms[meetingId];
      const endTime = new Date(Date.now())
      saveMeeting(room,meetingId,endTime);
      console.log(`Meeting ${meetingId} has been deleted due to no participants.`);
    }
    delete roomDeletionTimers[meetingId];
  }, 30000);  // Set a 2-minute timeout
};

// Cancel the room deletion if a participant joins before the timer expires
const cancelRoomDeletion = (meetingId) => {
  if (roomDeletionTimers[meetingId]) {
    clearTimeout(roomDeletionTimers[meetingId]);
    delete roomDeletionTimers[meetingId];
    console.log(`Room deletion for meeting ${meetingId} cancelled.`);
  }
};


// Handle socket connections
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);


  // Handle room joining
  socket.on('join-room', ({ meetingId, meetingPassword, userId, userName,colorId,micStatus,videoStatus, isHost}) => {
    console.log(meetingRooms[meetingId])
    console.log('sdfgsdfg')

    try {
      const room = meetingRooms[meetingId];
      if (!room) {
        console.log('Meeting Room not found' );
      }
      if(room.participants.includes(userId)){
        console.log(`User ${userId} is already in room: ${meetingId}` );
      }
  
      if(room && room.meetingPassword === meetingPassword){
        room.participants.push({ userId, userName, colorId,micStatus,videoStatus, isHost }); 
        socket.join(meetingId);
        console.log(room)
        console.log('Participant added successfully!')
        io.to(meetingId).emit('user-connected', {userId, userName,colorId,micStatus,videoStatus});
        socket.emit('joined-room', meetingId);
        
        const isScreenSharing = room.isScreenSharing;
        console.log(isScreenSharing)
        setTimeout(()=>{
        if(isScreenSharing){
          io.to(meetingId).emit('screen-share-started', { userId:room.screenSharer });
        }
      },800)

      cancelRoomDeletion(meetingId);
      }
      
    } catch (error) {
      console.error('Error adding participant:', error);
      return {success:false, message: 'Internal Server Error' };
    }

    // screen sharing


    socket.on('screen-share-start', ({ meetingId,userId }) => {
      console.log(`User ${userId} started screen sharing in room ${meetingId}`);
      meetingRooms[meetingId].isScreenSharing=true;
      meetingRooms[meetingId].screenSharer=userId;
      io.to(meetingId).emit('screen-share-started', { userId });
    });

    socket.on('screen-share-stop', ({ meetingId,userId }) => {
      console.log(`User ${userId} stopped screen sharing in room ${meetingId}`);
      meetingRooms[meetingId].isScreenSharing=false;
      meetingRooms[meetingId].screenSharer='';
      io.to(meetingId).emit('screen-share-stopped', { userId });
    });

    socket.on('video-status-change', ({ meetingId, userId ,videoStatus}) => {
      const room = meetingRooms[meetingId]
      const participant = room.participants.find((p) => p.userId === userId)
      participant.videoStatus = videoStatus;
      // console.log('video',room)
      io.to(meetingId).emit('video-status-changed', { userId ,videoStatus });
    });
    socket.on('mic-status-change', ({ meetingId, userId ,micStatus}) => {
      const room = meetingRooms[meetingId]
      const participant = room.participants.find((p) => p.userId === userId)
      participant.micStatus = micStatus;
      // console.log('mic',room)
      io.to(meetingId).emit('mic-status-changed', { userId ,micStatus });
    });

    socket.on('stream-media-update', ({ meetingId, userId}) => {
      const room = meetingRooms[meetingId]
      const participant = room.participants.find((p) => p.userId === userId)
      if (participant) {
        micStatus = participant.micStatus;
        videoStatus = participant.videoStatus;
        console.log('media', room);
        io.to(meetingId).emit('mic-status-changed', { userId, micStatus});
        io.to(meetingId).emit('video-status-changed', { userId, videoStatus});
      } else {
        console.log(`Participant with userId ${userId} not found in room ${meetingId}`);
      }
    });






    // Handle incoming chat messages
  socket.on('send-message', ({ meetingId, userId, userName, message }) => {
    console.log(meetingId, userId, userName, message)
    const roomChat = roomChats[meetingId];
    const room = meetingRooms[meetingId]
    if (!roomChat) {
      console.error('Room not found for chat');
      return;
    }
    const user = room.participants.find((participant) => participant.userId === userId)
    const chatMessage = {
      userId,
      userName,
      colorId:user.colorId,
      message,
      timestamp: new Date(),
    };

    // Store the message in the room's chat history
    if (!roomChats[meetingId]) {
      roomChats[meetingId] = [];
    }
    roomChats[meetingId].push(chatMessage);

    // Broadcast the message to all participants in the room
    io.to(meetingId).emit('receive-message', chatMessage);
    console.log(`Message sent to room ${meetingId} from ${userName}: ${message}`);
  });



    // Handle disconnection
    socket.on('disconnect', async () => {
      try {
        // console.log(`User disconnected ${socket.id}`);
        // let meetingRoom = await MeetingRoom.findOne({ roomId });
        const room = meetingRooms[meetingId];
        if (room) {
          room.participants = room.participants.filter((participant) => participant.userId !== userId);
          console.log(room.participants)
          socket.to(meetingId).emit('user-disconnected', userId);
          console.log(`User ${userId} disconnected from room: ${meetingId}`);
          
          if (room.participants.length === 0) {
            scheduleRoomDeletion(meetingId);
          }
        } else {
          console.error(`Meeting room with roomId ${meetingId} not found`);
        }

      } catch (error) {
        console.error('Error handling disconnect:', error);
      }

      


    });
    
    socket.on('end-meeting',({meetingId,userId})=>{
      console.log('456')
      console.log(meetingId,userId)
      const room = meetingRooms[meetingId];
      if(room && room.participants.some(participant => participant.userId === userId)){
        delete meetingRooms[meetingId];
        console.log(meetingRooms)
        io.to(meetingId).emit('meeting-ended');
      }
    })
}); //join-room ends

});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
