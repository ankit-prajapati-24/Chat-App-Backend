const http = require('http');
const path = require('path');
const express = require('express');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "*",
      credentials:true,
      methods: ["GET", "POST"]
    }
  });

app.use(express.static(path.resolve('./public')));

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
     
    socket.on('chat-message', (msg,roomid,) => {
        if(roomid != ""){
        const allRooms = io.sockets.adapter.rooms;
         socket.join(roomid);
         console.log("all rooms",allRooms,allRooms.has(roomid));
         socket.to(roomid).emit('chat-message', msg);
        // socket.broadcast.to(roomid).emit('chat-message', msg);
        }
        else{
            // socket.broadcast.emit('chat-message', msg);
            socket.join("")
        }
        console.log('Received message:', msg,roomid);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

app.use(
    cors({
      origin: "*",
      credentials: true
    })
  );
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
