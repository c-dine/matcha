import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';

@Injectable({
	providedIn: 'root'
})
export class ActivitySocketService extends SocketService {
	constructor() {
		super('/activity');
	}

	newActivity(message: "like" | "unlike" | "dislike" | "view" | "match", toUserId: string) {
		this.emit('new activity', { message: message, toUserId: toUserId });
	}

	getNewActivity() {
		return this.on('new activity');
	}
}
