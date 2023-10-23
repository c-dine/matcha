import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';

@Injectable({
	providedIn: 'root'
})
export class ActivitySocketService extends SocketService {
	constructor() {
		super('/activity');
	}

	sendMessage(message: string) {
		this.emit('activity', message);
	}
}
