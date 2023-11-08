import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';

@Injectable({
	providedIn: 'root'
})
export class ActivitySocketService extends SocketService {
	constructor() {
		super('/activity');
	}

	newActivity(type: string, toUserId: string) {
		this.emit('new activity', { message: type, toUserId: toUserId });
	}

	getNewActivity() {
		return this.on('new activity');
	}
}
