import { Subscription } from 'rxjs';
import { inject } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { User } from '@shared-models/user.model';
import { environment } from '@environment/environment';
import { UserService } from '../user.service';

export class SocketService {
	private userService: UserService;
	private socket!: Socket;
	private currentUser!: User | undefined;
	private subscriptions!: Subscription[];

	constructor(
		private socketNamespace: string,
	) {
		this.userService = inject(UserService);
		this.storeCurrentUser();
	}

	private storeCurrentUser() {
		this.subscriptions = [];
		this.subscriptions.push(
			this.userService.getCurrentUserObs().subscribe({
				next: (user) =>
					this.currentUser = user as User | undefined
			})
		);
	}

	connect() {
		const socketUrl = `${environment.url}${this.socketNamespace}`;
		this.socket = io(socketUrl, {
			path: environment.socketPath,
			query: {
				userId: this.currentUser?.id
			}
		});
	}

	disconnect() {
		this.socket.disconnect();
	}

	public emit(event: string, message: string) {
		this.socket.emit(event, message);
	}

	onDestroy() {
		this.disconnect();
		this.subscriptions.forEach(
			(subscription: Subscription) => subscription.unsubscribe()
		)
	}
}
