import { Injectable } from '@angular/core';
import { Message } from '@shared-models/chat.models';
import { take } from 'rxjs';
import { ChatService } from '../chat.service';
import { ChatSocketService } from '../socket/chatSocket.service';
import MessageError, { MessageErrorCode } from './message.error';
import { SubscriptionBase } from 'src/app/shared/subscriptionBase/subscription-base.component';

@Injectable({
	providedIn: 'root'
})
export class MessageService extends SubscriptionBase {
	messages: Message[] = [];
	messageToSend = '';
	isTyping: Boolean = false;
	conversationUserId: string | null | undefined = null;

	constructor(
		private chatService: ChatService,
		private chatSocket: ChatSocketService,
	) {
		super();
		this.setupSocketSubscriptions();
	}

	loadMessages(): void {
		if (!this.conversationUserId)
			return;
		this.chatService.getMessages(this.conversationUserId).pipe(take(1)).subscribe({
			next: (messages) => {
				this.messages = messages;
			},
		});
	}

	sendMessage(): void {
		if (!this.conversationUserId) {
			MessageError.handleError(MessageErrorCode.NoConversationSelected);
			return;
		}
		if (this.isEmptyMessageToSend()) {
			return;	
		}

		this.chatService.sendMessage(this.conversationUserId, this.messageToSend).pipe(take(1)).subscribe({
			next: (sendedMessage) => {
				if (!this.conversationUserId) return;
				this.messages.unshift(sendedMessage);
				this.chatSocket.sendMessage(sendedMessage.message, this.conversationUserId);
				this.messageToSend = '';
			},
		});
	}

	sendTyping(): void {
		if (!this.conversationUserId) {
			MessageError.handleError(MessageErrorCode.NoConversationSelected);
			return;
		}
		this.chatSocket.sendTyping(this.conversationUserId);
	}

	sendStopTyping(): void {
		if (!this.conversationUserId) {
			MessageError.handleError(MessageErrorCode.NoConversationSelected);
			return;
		}
		this.chatSocket.sendStopTyping(this.conversationUserId);
	}

	isEmptyMessageToSend(): boolean {
		return this.messageToSend.length === 0;
	}

	private setupSocketSubscriptions(): void {
		this.subscribeToSocketMessages();
		this.subscribeToTypingStatus();
	}

	private subscribeToSocketMessages(): void {
		this.subscriptions.push(
			this.chatSocket.getMessages().subscribe((socketEvent) => {
				if (this.isEventForCurrentConversation(socketEvent)) {
					this.addMessageToList(socketEvent);
				}
			})
		);
	}

	private subscribeToTypingStatus(): void {
		this.subscriptions.push(
			this.chatSocket.getTyping().subscribe((socketEvent) => {
				if (this.isEventForCurrentConversation(socketEvent)) {
					this.isTyping = true;
				}
			}),
			this.chatSocket.getStopTyping().subscribe((socketEvent) => {
				if (this.isEventForCurrentConversation(socketEvent)) {
					this.isTyping = false;
				}
			})
		);
	}

	private isEventForCurrentConversation(socketEvent: any): boolean {
		return this.conversationUserId === socketEvent.fromUserId;
	}

	private addMessageToList(socketMessage: any): void {
		const message: Message = {
			from_user_id: socketMessage.fromUserId || 'undefined',
			to_user_id: this.conversationUserId || 'undefined',
			message: socketMessage.data,
			date: new Date(),
		};
		this.messages.unshift(message);
	}
}

