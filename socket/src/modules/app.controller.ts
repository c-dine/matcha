import http from 'http';
import express from 'express';
import { Server } from 'socket.io';

class AppController {
	private app;
	private httpServer;
	public io;
	private controllers = [];

	constructor(
	) {
		this.app = express();
		this.httpServer = http.createServer(this.app);
		this.createSocketServer('/socket');
	}

	private createSocketServer(socketPath: string) {
		this.io = new Server(this.httpServer, {
			path: socketPath,
			cors: {
				origin: "*",
			}
		});
	}

	listen(port: number) {
		this.initializeControllers();
		this.httpServer.listen(port, () => {
			console.log(`Server started on port ${port}`);
		});
	}

	private initializeControllers() {
		for (const controller of this.controllers) {
			controller.connection();
		}
	}

	addController(controller) {
		this.controllers.push(controller);
	}
}

export default new AppController();
