import { inject } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { User } from '@shared-models/user.model';
import { environment } from '@environment/environment';
import { UserService } from '../user.service';
import { firstValueFrom } from 'rxjs';

export class SocketService {
	private userService: UserService;
	private socket!: Socket;
	private currentUser!: User | undefined;

	constructor(
		private socketNamespace: string,
	) {
		this.userService = inject(UserService);
	}

	private async storeCurrentUser() {
		this.currentUser = await firstValueFrom(this.userService.getCurrentUserObs()) as User;
	}

	async connect() {
		if (!this.currentUser)
			await this.storeCurrentUser();
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
}
