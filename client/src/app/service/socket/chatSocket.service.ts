import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';

@Injectable({
	providedIn: 'root'
})
export class ChatSocketService extends SocketService {
	constructor() {
		super('/chat');
	}

	sendMessage(message: string) {
		this.emit('sendMessage', message);
	}
}
