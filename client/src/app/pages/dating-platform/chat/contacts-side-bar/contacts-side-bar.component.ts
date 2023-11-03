import { Component } from '@angular/core';
import { Conversation } from '@shared-models/chat.models';
import { ChatService } from 'src/app/service/chat.service';
import { Output, Input, EventEmitter } from '@angular/core';
import { firstValueFrom } from 'rxjs'
import { UserService } from 'src/app/service/user.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
	selector: 'app-contacts-side-bar',
	templateUrl: './contacts-side-bar.component.html',
	styleUrls: ['./contacts-side-bar.component.css']
})
export class ContactsSideBarComponent {
	conversations!: Conversation[];
	matchs!: Conversation[];
	conversationUserId!: string | null;

	@Output()
	onConversationClick!: EventEmitter<any>;

	constructor(
		private chatService: ChatService,
		private userService: UserService,
		private router: Router,
		private route: ActivatedRoute,
	) {
		this.conversations = [];
		this.matchs = [];
		this.onConversationClick = new EventEmitter();
	}

	async ngOnInit() {
		this.route.paramMap.subscribe((params: ParamMap) => {
			this.conversationUserId = params.get('id');
		});
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
		return (await firstValueFrom(this.userService.getMatchs()))
				.userList.map(
						user => new Conversation(
							user.firstName,
							user.lastName,
							"",
							"",
							user.id,
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

	navigateToUserConversation(userId: string | undefined) {
		if (!userId)
			return ;
		this.router.navigate([`app/chat/${userId}`])
	}

}
