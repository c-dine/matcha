import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ChatSocketService extends SocketService {
	constructor() {
		super('/chat');
	}

	sendMessage(message: string, toUserId: string, id?: string) {
		this.emit('new message', {message: message, toUserId: toUserId, id});
	}

	getMessages() {
		return this.on('new message');
	}

	sendTyping(toUserId: string) {
		this.emit('typing', {message: 'typing', toUserId: toUserId});
	}

	getTyping() {
		return this.on('typing');
	}

	sendStopTyping(toUserId: string) {
		this.emit('stop typing', {message: 'stop typing', toUserId: toUserId});
	}

	getStopTyping() {
		return this.on('stop typing');
	}
}
