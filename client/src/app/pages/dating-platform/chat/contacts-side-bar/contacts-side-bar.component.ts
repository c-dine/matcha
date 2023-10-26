import { Component } from '@angular/core';
import { Conversation } from '@shared-models/chat.models';
import { ChatService } from 'src/app/service/chat.service';
import { Output, Input, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-contacts-side-bar',
	templateUrl: './contacts-side-bar.component.html',
	styleUrls: ['./contacts-side-bar.component.css']
})
export class ContactsSideBarComponent {
	conversations!: Conversation[];

	@Input()
	selectedConversation!: Conversation | undefined;

	@Output()
	onConversationClick!: EventEmitter<any>;

	constructor(
		private chatService: ChatService
	) {
		this.conversations = [];
		this.selectedConversation = undefined;
		this.onConversationClick = new EventEmitter();
	}

	ngOnInit() {
		this.chatService.getConversations().subscribe({
			next: (conversations) => this.conversations = conversations
		});
	}

	setConversationUserID(userId: Conversation) {
		this.onConversationClick.emit(userId);
	}
}
