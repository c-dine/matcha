import http from 'http';
import express from 'express';
import { Server } from 'socket.io';
import { SocketRouter } from './sockerRouter.js';
import { SocketRoutes } from './sockerRouter.js';

export class SocketServer {
	private app;
	private httpServer;
	public io;
	private socketRouter: SocketRouter;

	constructor(
	) {
		this.app = express();
		this.httpServer = http.createServer(this.app);
		this.io = this.createSocketServer('/socket');
		this.socketRouter = new SocketRouter();
	}

	private createSocketServer(socketPath: string) {
		return new Server(this.httpServer, {
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
		this.socketRouter.forEach(
			(socketNamespace, route) => {
				socketNamespace.setNamespace(route);
				socketNamespace.connect();
			}
		);
	}

	useRoutes(routes?: SocketRoutes[]): void {
		routes.forEach(
			(route) => this.socketRouter.setRoute(route.route, route.socketNamespace)
		)
	}
}
