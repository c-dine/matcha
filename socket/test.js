import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
	path: "/socket",
	cors: {
		origin: "*",
	}
});

console.log('test');

app.get("/", () => {
	console.log('test')
	next();
	return "test";
})

io.on('connection', (socket) => {
	console.log('A user connected'); // Log when a user connects

	socket.on('disconnect', () => {
		console.log('User disconnected'); // Log when a user disconnects
	});
});

httpServer.listen(3002, () => {
	console.log('Server started on port 3002');
});

