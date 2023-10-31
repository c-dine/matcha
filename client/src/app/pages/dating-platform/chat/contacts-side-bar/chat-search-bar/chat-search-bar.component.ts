import { Component } from '@angular/core';
import { ProfileService } from 'src/app/service/profile.service';
import { Subscription } from 'rxjs'
import { getFirebasePictureUrl } from 'src/app/utils/picture.utils';
import { Output, EventEmitter } from '@angular/core';
import { Conversation } from '@shared-models/chat.models';

@Component({
  selector: 'app-chat-search-bar',
  templateUrl: './chat-search-bar.component.html',
  styleUrls: ['./chat-search-bar.component.css']
})
export class ChatSearchBarComponent {
	subscritpions!: Subscription[];
	matchs!: Conversation[];
	matchCount!: number;

	@Output()
	onMatchClick!: EventEmitter<any>;

	constructor(
		private profileService: ProfileService
	) {
		this.subscritpions = [];
		this.matchs = [];
		this.matchCount = 0;
		this.onMatchClick = new EventEmitter();
	}

	ngOnInit() {
		this.profileService.getMatchs().subscribe({
			next: (userProfiles) => {
				this.matchs = userProfiles.userList.map(
					user => new Conversation(
						user.firstName,
						user.lastName,
						"",
						"",
						user.id,
						user.userId,
						user.picturesIds,
				))
				this.matchCount = userProfiles.totalUserCount;
			}
		})
	}

	pictureIdToPictureUrl(id: string| undefined) {
		return getFirebasePictureUrl(id);
	}

	setConversation(conversation: Conversation) {
		this.onMatchClick.emit(conversation);
	}
}
