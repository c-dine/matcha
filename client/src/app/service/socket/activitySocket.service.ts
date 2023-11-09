import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';
import { ActivityTypes } from '@shared-models/notification.model';

@Injectable({
	providedIn: 'root'
})
export class ActivitySocketService extends SocketService {
	constructor() {
		super('/activity');
	}

	newActivity(message: ActivityTypes, toUserId: string, id?: string) {
		this.emit('new activity', { message: message, toUserId: toUserId, id: id });
	}

	getNewActivity() {
		return this.on('new activity');
	}
}
