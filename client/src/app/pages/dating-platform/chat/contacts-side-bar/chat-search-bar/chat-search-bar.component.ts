import { Component, Input } from '@angular/core';
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
	@Input()
	matchs!: Conversation[];

	@Output()
	onMatchClick!: EventEmitter<any>;

	constructor(
	) {
		this.onMatchClick = new EventEmitter();
	}

	ngOnInit() {
	}

	pictureIdToPictureUrl(id: string| undefined) {
		return getFirebasePictureUrl(id);
	}

	setConversation(conversation: Conversation) {
		this.onMatchClick.emit(conversation);
	}
}
