

// const express = require('express');
// const cors = require('cors');
// const http = require('http');
// const { Server } = require('socket.io');
// // const { ExpressPeerServer } = require('peer');

// const app = express();
// app.use(cors());
// app.use(express.json());

// const server = http.createServer(app);
// const io = new Server(server,{
//   cors:{
//     origin:"http://localhost:3000",
//     methods: ["GET","POST"],
//   },
// });
// // const peerServer = ExpressPeerServer(server, {
// //   debug: true,
// // });

// // app.use('/peerjs', peerServer);


// let meetingRooms = {};




// app.post('/create-room', (req, res) => {
//   const { meetingId, meetingPassword } = req.body;
//   meetingRooms[meetingId] = { password: meetingPassword, users: [] };
//   res.status(200).send({ message: 'Room created' });
// });

// app.post('/join-room', (req, res) => {
//   const { meetingId, meetingPassword } = req.body;
//   const room = meetingRooms[meetingId];
//   if (room && room.password === meetingPassword) {
//     res.status(200).send({ message: 'Joined room' });
//   } else {
//     res.status(401).send({ message: 'Invalid meeting ID or password' });
//   }
// });







// // Handle socket connections
// io.on('connection', (socket) => {
  
//   console.log(`User connected: ${socket.id}`);

//     socket.on('message', (data)=>{
//     console.log(data)
//     socket.to(data.roomId).emit('alert', data.message);
//   });

//   // Join an existing room
//   socket.on('join-room', ({ roomId, password, userId }) => {
//     console.log(roomId, password)
//     const room = meetingRooms[roomId];
//     console.log(room)

//     // const userId = socket.id;
//     console.log(meetingRooms,room)
//     // if (room) {
//     //   if (room.password === null || room.password === password) {
//         room.users.push(userId);
//         socket.join(roomId);
//         socket.to(roomId).emit('user-connected', { userId, signalFromNewUser: room ? true : false });
//         // socket.to(roomId).emit('user-connected', userId);
//         socket.emit('joined-room', roomId);
//         console.log(`User ${userId} joined room: ${roomId}`);
  

//     socket.on('sending-signal', ({ signal, callerId }) => {
//       io.to(roomId).emit('receiving-signal', { signal, callerId });
//     });
  

//   socket.on('disconnect', () => {
//     for (const roomId in meetingRooms) {
//       const room = meetingRooms[roomId];
//       room.users = room.users.filter((id) => id !== socket.id);
//       socket.to(roomId).emit('user-disconnected', socket.id);
//       console.log(`User ${socket.id} disconnected from room: ${roomId}`);

//       // Delete the room if all users have left
//       if (room.users.length === 0) {
//         delete meetingRooms[roomId];
//         console.log(`Room deleted: ${roomId}`);
//       }
//     }
//   });

// });

  
// });

// // Start the server
// server.listen(3001, () => {
//   console.log('Server is running on port 3001');
// });




const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { ExpressPeerServer } = require('peer');

// Initialize express app
const app = express();
app.use(
  cors({
    origin: "*", // replace with the URL of your React app
  })
);
app.use(express.json());

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

// Route to create a room
app.post('/create-room', (req, res) => {
  const { meetingId, meetingPassword } = req.body;
  meetingRooms[meetingId] = { password: meetingPassword, meetingDetail:{},host:'', users: [] };
  res.status(200).send({ message: 'Room created' });
});

// Route to join a room
app.post('/join-room', (req, res) => {
  const { meetingId, meetingPassword } = req.body;
  const room = meetingRooms[meetingId];
  if (room && room.password === meetingPassword) {
    res.status(200).send({ message: 'Joined room' });
  } else {
    res.status(401).send({ message: 'Invalid meeting ID or password' });
  }
});

// Handle socket connections
io.on('connection', (socket) => {
  // console.log(`User connected: ${socket.id}`);


  // Handle room joining
  socket.on('join-room', ({ roomId, password, userId }) => {
    const room = meetingRooms[roomId];

    if (room) {
      if (room.password === password) {
        if (!room.users.includes(userId)) {
          room.users.push(userId);
          socket.join(roomId);
          console.log(room)
          io.to(roomId).emit('user-connected', userId);
          socket.emit('joined-room', roomId);
          console.log(`User ${userId} joined room: ${roomId}`);
        } else {
          console.log(`User ${userId} is already in room: ${roomId}`);
        }
      } else {
        socket.emit('wrong-password', roomId);
      }
    } else {
      socket.emit('room-not-found', roomId);
    }
  

  // Handle disconnection
  socket.on('disconnect', () => {
    for (const roomId in meetingRooms) {
      const room = meetingRooms[roomId];
      room.users = room.users.filter((id) => id !== userId);
      socket.to(roomId).emit('user-disconnected', userId);
      console.log(`User ${userId} disconnected from room: ${roomId}`);

      // Delete the room if all users have left
      if (room.users.length === 0) {
        delete meetingRooms[roomId];
        console.log(`Room deleted: ${roomId}`);
      }
    }
  });
}); //join-room ends

  // Handle sending messages within a room
  socket.on('message', (data) => {
    socket.to(data.roomId).emit('alert', data.message);
  });
});

// Start the server
server.listen(3001, '0.0.0.0',() => {
  console.log('Server is running on port 3001');
});
