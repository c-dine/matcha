import { Component, Input, SimpleChanges } from '@angular/core';
import { Conversation, Message } from '@shared-models/chat.models';
import { ChatService } from 'src/app/service/chat.service';
import { getFirebasePictureUrl } from 'src/app/utils/picture.utils';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-conversation',
	templateUrl: './conversation.component.html',
	styleUrls: ['./conversation.component.css']
})
export class ConversationComponent {
	@Input()
	conversation!: Conversation | undefined;

	messages!: Message[]
	profilePictureUrl!: string;
	messageToSend!: string;

	subscriptions!: Subscription[]

	constructor(
		private chatService: ChatService,
	) {
		this.conversation = undefined
		this.messages = [];
		this.subscriptions = [];
		this.profilePictureUrl = "";
		this.messageToSend = "";
	}

	ngOnInit() {
	}

	ngOnChanges(changes: SimpleChanges) {
		if (this.conversation === undefined)
			return;
		this.profilePictureUrl = this.pictureIdToUrl(this.conversation.picture_id);
		this.subscriptions.push(
			this.chatService.getMessages(this.conversation?.user_id).subscribe({
				next: (messages) => {
					this.messages = messages
				}
			})
		);
	}

	private pictureIdToUrl(pictureId: string) {
		return getFirebasePictureUrl(pictureId);
	}

	sendMessage() {
		if (!this.conversation?.user_id) {
			console.error("No conversation selected");
			return;
		}
		if (this.isEmptyMessageToSend())
			return;
		this.subscriptions.push(
			this.chatService.sendMessage(this.conversation?.user_id, this.messageToSend)
				.subscribe({
					next: (sendedMessage) => {
						this.messages.unshift(sendedMessage);
						this.messageToSend = "";
					}
				})
		);
	}

	private isEmptyMessageToSend() {
		return this.messageToSend.length === 0;
	}

	hasConversationSelected() {
		return this.conversation !== undefined;
	}

	ngOnDestroy() {
		this.subscriptions.forEach(
			(subscription) => subscription.unsubscribe()
		);
	}
}
