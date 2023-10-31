import { Component, Input, SimpleChanges } from '@angular/core';
import { Conversation, Message } from '@shared-models/chat.models';
import { ChatService } from 'src/app/service/chat.service';
import { getFirebasePictureUrl } from 'src/app/utils/picture.utils';
import { Subscription, firstValueFrom, take } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ChatSocketService } from 'src/app/service/socket/chatSocket.service';
import { UserService } from 'src/app/service/user.service';
import { User } from '@shared-models/user.model';

@Component({
	selector: 'app-conversation',
	templateUrl: './conversation.component.html',
	styleUrls: ['./conversation.component.css']
})
export class ConversationComponent {
	@Input()
	conversation!: Conversation | undefined;

	conversationUserId!: string | null;
	currentUser!: User | undefined;
	messages!: Message[]
	profilePictureUrl!: string;
	messageToSend!: string;
	subscriptions!: Subscription[];
	isTyping!: Boolean;

	constructor(
		private chatService: ChatService,
		private chatSocket: ChatSocketService,
		private userService: UserService,
		private route: ActivatedRoute,
	) {
		this.conversation = undefined
		this.messages = [];
		this.profilePictureUrl = "";
		this.messageToSend = "";
		this.subscriptions = [];
		this.isTyping = false;
		this.userService.getCurrentUserObs()
			.pipe(take(1)).subscribe(user => this.currentUser = user);
	}

	ngOnInit() {
		this.route.paramMap.subscribe((params: ParamMap) => {
			this.conversationUserId = params.get('id');
		});
		this.subscriptions.push(
			this.chatSocket.getMessages().subscribe((socketMessage) => {
				if (this.conversation?.user_id !== socketMessage.fromUserId)
					return ;
				this.addMessageToList(socketMessage)
			}),
			this.chatSocket.getTyping().subscribe((socketMessage) => {
				if (this.conversation?.user_id !== socketMessage.fromUserId)
					return ;
				this.isTyping = true;
			}),
			this.chatSocket.getStopTyping().subscribe((socketMessage) => {
				if (this.conversation?.user_id !== socketMessage.fromUserId)
					return ;
				this.isTyping = false;
			}),
		)
	}

	private addMessageToList(socketMessage: any) {
		let message = {
			from_user_id: socketMessage.fromUserId || 'undefined',
			to_user_id: socketMessage.toUserId || 'undefined',
			message: socketMessage.data,
			date: new Date()
		}
		this.messages.unshift(message);
	}

	ngOnChanges(changes: SimpleChanges) {
		if (this.conversation === undefined)
			return;
		this.profilePictureUrl = this.pictureIdToUrl(this.conversation.picturesIds?.profilePicture);
		this.chatService.getMessages(this.conversation?.user_id).pipe(take(1)).subscribe({
			next: (messages) => {
				this.messages = messages
			}
		});
	}

	private pictureIdToUrl(pictureId: string | undefined) {
		return getFirebasePictureUrl(pictureId);
	}

	sendMessage() {
		let toUserId = this.conversation?.user_id;
		if (!toUserId) {
			console.error("No conversation selected");
			return ;
		}
		if (this.isEmptyMessageToSend())
			return ;

		this.chatService.sendMessage(toUserId, this.messageToSend)
		.pipe(take(1)).subscribe({
				next: (sendedMessage) => {
					if (!toUserId)
						return ;
					this.messages.unshift(sendedMessage);
					this.chatSocket.sendMessage(sendedMessage.message, toUserId);
					this.messageToSend = "";
				}
			});
	}

	sendTyping() {
		let toUserId = this.conversation?.user_id;
		if (!toUserId) {
			console.error("No conversation selected");
			return ;
		}
		this.chatSocket.sendTyping(toUserId);
	}

	sendStopTyping() {
		let toUserId = this.conversation?.user_id;
		if (!toUserId) {
			console.error("No conversation selected");
			return ;
		}
		this.chatSocket.sendStopTyping(toUserId);
	}

	private isEmptyMessageToSend() {
		return this.messageToSend.length === 0;
	}

	hasConversationSelected() {
		return this.conversation !== undefined;
	}
	
	ngOnDestroy() {
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		});
	}
}
