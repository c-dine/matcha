import { Component } from '@angular/core';
import { Conversation } from '@shared-models/chat.models';
import { ChatService } from 'src/app/service/chat.service';
import { Output, Input, EventEmitter } from '@angular/core';
import { firstValueFrom } from 'rxjs'
import { ProfileService } from 'src/app/service/profile.service';

@Component({
	selector: 'app-contacts-side-bar',
	templateUrl: './contacts-side-bar.component.html',
	styleUrls: ['./contacts-side-bar.component.css']
})
export class ContactsSideBarComponent {
	conversations!: Conversation[];
	matchs!: Conversation[];

	@Input()
	selectedConversation!: Conversation | undefined;

	@Output()
	onConversationClick!: EventEmitter<any>;

	constructor(
		private chatService: ChatService,
		private profileService: ProfileService
	) {
		this.conversations = [];
		this.matchs = [];
		this.selectedConversation = undefined;
		this.onConversationClick = new EventEmitter();
	}

	async ngOnInit() {
		this.conversations = await firstValueFrom(this.chatService.getConversations());
		this.matchs = (await this.getMatchs())
			.filter(
				(match) => !this.conversations.some(
						(conversation) => conversation.user_id === match.user_id,
						match
					)
			)
	}

	private async getMatchs() {
		return (await firstValueFrom(this.profileService.getMatchs()))
				.userList.map(
						user => new Conversation(
							user.firstName,
							user.lastName,
							"",
							"",
							user.id,
							user.userId,
							user.picturesIds,
						)
				)
	}

	setConversationUserID(match: Conversation) {
		let indexOfMatch = this.matchs.indexOf(match);
		if (indexOfMatch > -1) {
			this.matchs.splice(indexOfMatch, 1);
			this.conversations.unshift(match);
		}
		this.onConversationClick.emit(match);
	}

}
