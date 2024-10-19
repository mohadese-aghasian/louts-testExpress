const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Create an Express app
const app = express();

// Create an HTTP server
const server = http.createServer(app);

// Bind Socket.IO to the server
const io = socketIo(server);

// Serve the client a simple HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Handle connection events when a client connects
io.on('connection', (socket) => {
    console.log('A client connected:', socket.id);

    // Listen for messages from the client
    socket.on('clientMessage', (message) => {
        console.log('Received from client:', message);

        // Send a message back to the client
        // socket.emit('serverMessage', message);
        socket.broadcast.emit('serverMessage', message);
    });

    // Handle client disconnect
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
