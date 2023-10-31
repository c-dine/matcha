import { Observable, Subscription } from 'rxjs';
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
				next: (user: User | undefined) =>
					this.currentUser = user
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

	emit(event: string, arg: any) {
		arg.fromUserId = this.currentUser?.id
		this.socket.emit(event, arg);
	}

	on(eventName: string) {
		let observable = new Observable<any>(observer => {
			this.socket.on(eventName,
				(data) => {
					observer.next(data);
				}
			);
				return () => { this.socket.disconnect(); };  
			});
		return observable;
	}

	onDestroy() {
		this.disconnect();
		this.subscriptions.forEach(
			(subscription: Subscription) => subscription.unsubscribe()
		)
	}
}
