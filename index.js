const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors:{
    origin:"*",
  }
});

// Serve your static files or set up your routes
app.use(express.static(__dirname + '/public'));

// Socket.IO server logic
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Listen for custom 'chat-message' event
    socket.on('chat-message', (msg) => {
        console.log('Received message:', msg);
        // Broadcast the message to all connected clients
        io.emit('chat-message', msg);
    });

    // Disconnect event
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// HTTP proxy middleware
const proxyMiddleware = createProxyMiddleware('/api', {
    target: 'http://localhost:4000',  // Adjust the backend API server URL
    changeOrigin: true,
});

app.use('/api', proxyMiddleware);

// Start the combined server
const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
