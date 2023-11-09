import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';

@Injectable({
	providedIn: 'root'
})
export class connectionSocketService extends SocketService {
	constructor() {
		super('/connection');
	}

	askIfConnected(userId: string) {
		this.emit('is connected', { message: 'connected ?', toUserId: userId});
	}

	getisConnected() {
		return this.on('is connected');
	}
}
