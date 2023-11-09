import { SocketServer } from './socketServer.js';
import { SocketRoutes } from './socketRouter.js';

class SocketNamespace {
	private static server = new SocketServer();
	private connectedUsers: Map<string, any>;
	private events: Map<string, (...args: any[]) => void>;

	constructor(public namespace: string = '/') {
		this.namespace = namespace;
		this.connectedUsers = new Map<string, any>();
		this.events = new Map<string, (...args: any[]) => void>();
	}

	setNamespace(namespace: string) {
		this.namespace = namespace;
	}

	connect() {
		const server = SocketNamespace.server;
		server.io.of(this.namespace).on('connection', (socket) => {
			this.handleConnection(socket);
		});
	}

	handleConnection(socket) {
		const userId = socket.handshake.query.userId;
		this.connectedUsers.set(userId, {
			id: socket.id,
			socket: socket,
		});

		this.setupSocketEvents(socket);

		socket.on('disconnect', () => {
			this.handleDisconnect(userId);
		});
	}

	setupSocketEvents(socket) {
		this.events.forEach((eventFunction, eventName) => {
			socket.on(eventName, eventFunction);
		});
	}

	handleDisconnect(userId) {
		console.log(`user disconnected of ${this.namespace}`);
		this.connectedUsers.delete(userId);
	}

	event(eventName: string, eventFunction: (...args: any[]) => void) {
		this.events.set(eventName, eventFunction);
	}

	emitTo(eventName: string, arg: any) {
		// envoyer a tous
		const toUserId = arg.toUserId;
		const fromUserId = arg.fromUserId;

		if (!this.connectedUsers.has(toUserId) || !this.connectedUsers.has(fromUserId)) {
			throw new Error('User not connected');
		}

		const toUser = this.connectedUsers.get(toUserId);
		const fromUser = this.connectedUsers.get(fromUserId);

		fromUser.socket.to(toUser.id).emit(eventName, {
			id: arg.id,
			fromUserId,
			toUserId,
			date: new Date(),
			message: arg.message,
		});
	}

	emitIsConnected(eventName: string, arg: any) {
		const toUserId = arg.toUserId;
		const fromUserId = arg.fromUserId;

		const fromUser = this.connectedUsers.get(fromUserId);
		console.log(this.connectedUsers.has(toUserId))
		fromUser.socket.emit(eventName, {
			id: arg.id,
			fromUserId,
			toUserId,
			date: new Date(),
			message: (this.connectedUsers.has(toUserId)) ? "connected" : "not connected",
		});
	}

	listen(port: number) {
		SocketNamespace.server.listen(port);
	}

	useRoutes(routes?: SocketRoutes[]): void {
		SocketNamespace.server.useRoutes(routes);
	}
}

const socketRC = (route?: string) => {
	return new SocketNamespace(route);
};

export { SocketNamespace, socketRC };
