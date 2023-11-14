import { Component } from '@angular/core';
import { Conversation } from '@shared-models/chat.models';
import { ChatService } from 'src/app/service/chat.service';
import { Output, EventEmitter } from '@angular/core';
import { firstValueFrom, take } from 'rxjs'
import { UserService } from 'src/app/service/user.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
	selector: 'app-contacts-side-bar',
	templateUrl: './contacts-side-bar.component.html',
	styleUrls: ['./contacts-side-bar.component.css', '../../../../styles/text.css']
})
export class ContactsSideBarComponent {
	conversations!: Conversation[];
	matchs!: Conversation[];
	routeUserId!: string | null;

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
		await this.handleRouteParams();
		await this.loadConversations();
		await this.loadMatchs();
		this.processConversationsBasedOnRoute();
	}

	private async handleRouteParams() {
		this.route.paramMap.subscribe((params: ParamMap) => {
			this.routeUserId = params.get('id');
		});
	}

	private async loadConversations() {
		this.conversations = await firstValueFrom(this.chatService.getConversations());
	}

	private async loadMatchs() {
		this.matchs = await this.getMatchs();
	}

	private async getMatchs() {
		return (await firstValueFrom(this.userService.getMatchs()));
	}

	private processConversationsBasedOnRoute() {
		if (this.routeUserId && !this.conversationsHasUserId(this.routeUserId)) {
			this.addMatchToConversations();
		}
		this.filterAndRemoveExistingMatchs();
	}

	private addMatchToConversations() {
		let match = this.matchs.find((conv) => conv.author.id === this.routeUserId);
		if (match) {
			this.conversations.push(match);
		}
	}

	private filterAndRemoveExistingMatchs() {
		this.matchs = this.matchs?.filter((match) => {
			return !this.conversations.some((conversation) => conversation.author.id === match.author.id) && match.author.id !== this.routeUserId;
		});
	}

	private conversationsHasUserId(userId: string): boolean {
		return this.conversations.some((conversation) => conversation.author.id === userId);
	}

	navigateToUserConversation(userId: string | undefined) {
		if (!userId)
			return;
		return this.router.navigate([`app/chat/${userId}`])
	}
}
