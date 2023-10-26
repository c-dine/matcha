import { Component } from '@angular/core';
import { UserProfile } from '@shared-models/profile.model';
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
	matchs!: UserProfile[];
	matchCount!: number;

	@Output()
	onMatchClick!: EventEmitter<any>;

	constructor(
		private profileService: ProfileService
	) {
		this.subscritpions = [];
		this.matchs = [];
		this.matchCount = 0;
	}

	ngOnInit() {
		this.profileService.getMatchs().subscribe({
			next: (userProfiles) => {
				this.matchs = [...userProfiles.userList];
				this.matchCount = userProfiles.totalUserCount;
			}
		}) // ajouter un nouveau match avec socket activity
	}

	pictureIdToPictureUrl(id: string| undefined) {
		return getFirebasePictureUrl(id);
	}

	setConversation(userProfile: UserProfile) {
		// let pictureId = userProfile.picturesIds?.profilePicture || '';
		// let conversation: Conversation = {
		// 	firstname: userProfile.firstName,
		// 	lastname: userProfile.lastName,
		// 	last_message: "",
		// 	latest_date: "",
		// 	picture_id: pictureId,
		// 	profile_id: userProfile.id,

		// }
		// userProfile.
		// this.onMatchClick.emit(userProfile);
	}
}
