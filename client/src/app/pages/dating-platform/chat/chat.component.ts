import { Component } from '@angular/core';
import { Conversation } from '@shared-models/chat.models';
import { ProfileService } from 'src/app/service/profile.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
	selectedConversation: Conversation | undefined;

	constructor(
		private profileService: ProfileService
	) {
		this.selectedConversation = undefined;
	}

	ngOnInit() {
	}

	async sendMessage() {
		let matchs = await this.profileService.getMatchs().subscribe();
		console.log(matchs);
	}

	setSelectedConversation(userId: Conversation) {
		this.selectedConversation = userId;
	}
}
