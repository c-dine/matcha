import appController from './app.controller.js';

class SocketBaseController {
	static appController = appController;
	private connectedUsers: Map<string, any>;
	private events: Map<string, (...args: any[]) => void>;

	constructor(
		private route?: string,
	) {
		if (route !== undefined) {
			this.connectedUsers = new Map<string, any>();
			this.events = new Map<string, (...args: any[]) => void>();
		}
	}

	connection() {
		console.log(`opebn route on ${this.route}`)
		appController.io.of(this.route).on('connection', (socket) => {
			console.log(`user connected to ${this.route}`)
			this.connectedUsers.set(socket.id, socket.handshake.query.userId);
			console.log(this.connectedUsers)
		
			this.events.forEach((eventFunction, eventName) => {
				socket.on(eventName, eventFunction);
			})

			socket.on('disconnect', () => {
				console.log(`user disconnected of ${this.route}`)
				this.connectedUsers.delete(socket.id);
			});
		});
	}

	event(eventName: string, eventFunction: (...args: any[]) => void) {
		this.events.set(eventName, eventFunction);
	}

	listen(port: number) {
		appController.listen(port);
	}

	use(controller: SocketBaseController): void {
		appController.addController(controller);
	}
};

export const socketRC = (route?: string) => {
	return new SocketBaseController(route);
};
