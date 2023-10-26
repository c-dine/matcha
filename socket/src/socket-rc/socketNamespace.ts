import { SocketServer } from './socketServer.js';
import { SocketRoutes } from './sockerRouter.js';

export class SocketNamespace {
	private static server = new SocketServer();
	private connectedUsers: Map<string, any>;
	private events: Map<string, (...args: any[]) => void>;

	constructor(
		public namespace?: string,
	) {
			this.namespace = namespace || '/';
			this.connectedUsers = new Map<string, any>();
			this.events = new Map<string, (...args: any[]) => void>();
	}

	setNamespace(namespace: string) {
		this.namespace = namespace;
	}

	connect() {
		console.log(`open namespace on ${this.namespace}`)
		SocketNamespace.server.io.of(this.namespace).on('connection', (socket) => {
			console.log(`user connected to ${this.namespace}`)
			this.connectedUsers.set(socket.id, socket.handshake.query.userId);
			console.log(this.connectedUsers)
		
			this.events.forEach((eventFunction, eventName) => {
				socket.on(eventName, eventFunction);
			})

			socket.on('disconnect', () => {
				console.log(`user disconnected of ${this.namespace}`)
				this.connectedUsers.delete(socket.id);
			});
		});
	}

	event(eventName: string, eventFunction: (...args: any[]) => void) {
		this.events.set(eventName, eventFunction);
	}

	listen(port: number) {
		SocketNamespace.server.listen(port);
	}

	useRoutes(routes?: SocketRoutes[]): void {
		SocketNamespace.server.useRoutes(routes);
	}
};

export const socketRC = (route?: string) => {
	return new SocketNamespace(route);
};
