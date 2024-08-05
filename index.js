// Dependencies
const http = require('http');
const path = require('path');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');
const {phone} = require('phone');

const fileUpload = require('express-fileupload');
require('dotenv').config();

// Custom Modules
const dbconnect = require('./config/connectToDb');
const { addMessageInRoom, addImageInRoom } = require('./controllers/MessageController');
const { ConnectCloadinary } = require('./config/Coudinary');

// Routes
const ProfileRoute = require('./routes/ProfileController');
const MessageRoute = require('./routes/MessageRoute');
const AuthRoute = require('./routes/AuthRoute');

// Express App Setup
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(express.static(path.resolve('./public')));
app.use(bodyParser.json());
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp',
  })
);
app.use(bodyParser.json({ limit: '10mb' }));

// Socket.IO Setup
io.on('connection', (socket) => {
  //console.log('A user connected:', socket.id);

  socket.on('chat-message', async (msg, sender, reciever, name,Date) => {
    // Handle chat messages
    console.log(msg, sender,reciever,name,Date);
    const Roomid = `${sender}${reciever}`;
    const existRoomid = `${reciever}${sender}`;
    const allRooms = io.sockets.adapter.rooms;


    if (allRooms.has(existRoomid)){
      // If existing room, join and emit message
      console.log("Room already exists");
      socket.join(existRoomid);
      socket.to(existRoomid).emit('chat-message', msg);
      const result = await addMessageInRoom(sender,reciever, msg, name, sender,Date);
      
    } else {
      console.log("Room not already exists");
      socket.join(Roomid);
      socket.to(Roomid).emit('chat-message', msg);
      const result = await addMessageInRoom(sender,reciever, msg, name, sender,Date);
    }

    console.log('Received message:', msg, sender, reciever,Date);
  });

  socket.on('image-message', async (image, sender, reciever, name,Date) => {
    // Handle chat messages
    console.log(image, sender,reciever,name,Date);
    const Roomid = `${sender}${reciever}`;
    const existRoomid = `${reciever}${sender}`;
    const allRooms = io.sockets.adapter.rooms;


    if (allRooms.has(existRoomid)){
      // If existing room, join and emit message
      console.log("Room already exists");
      socket.join(existRoomid);
      socket.to(existRoomid).emit('image-message', image);
      const result = await addImageInRoom(sender,reciever, image, name, sender,Date);
      
    } else {
      console.log("Room not already exists");
      socket.join(Roomid);
      socket.to(Roomid).emit('image-message', image);
      const result = await addImageInRoom(sender,reciever,image, name, sender,Date);
    }
    console.log('Received message:', image, sender, reciever,Date);
  });


  socket.on('connectRoom', async (msg, sender, reciever, name) => {
    // Handle chat messages

    const Roomid = `${sender}${reciever}`;
    const existRoomid = `${reciever}${sender}`;
    const allRooms = io.sockets.adapter.rooms;



    if (allRooms.has(existRoomid)) {
      socket.join(existRoomid);
      console.log('Connected to existing room', existRoomid);
    } else {
      // If new room, join and emit message
      socket.join(Roomid);
      console.log('Connected to new room', Roomid);
    }
    console.log('Received request for connect romm:', msg, sender, reciever);
  });

  socket.on('disconnect', () => {
    // Handle user disconnection
    console.log('User disconnected:', socket.id);
  });
});

// Routes
app.use("/api/v1/Auth",AuthRoute);
app.use("/api/v1/Profile",ProfileRoute);
app.use("/api/v1/Message",MessageRoute);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Server Setup
const PORT = process.env.PORT || 4000;
dbconnect();
ConnectCloadinary();

// Start Server
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
