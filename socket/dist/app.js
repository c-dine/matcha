// Import the Express framework
const express = require('express');
// Create an Express application
const app = express();
// Create an HTTP server using Express
const httpServer = require('http').createServer(app);
// Create a WebSocket server using Socket.IO and attach it to the HTTP server
const io = require('socket.io')(httpServer);
// Handle WebSocket connections
io.on('connection', (socket) => {
    console.log('A user connected'); // Log when a user connects
    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected'); // Log when a user disconnects
    });
});
httpServer.listen(3002, () => {
    console.log('Server started on port 3002');
});
