import { Component, Input } from '@angular/core';
import { Conversation } from '@shared-models/chat.models';
import { getFirebasePictureUrl } from 'src/app/utils/picture.utils';
import { printTime } from 'src/app/utils/timePrinter.utils';

@Component({
	selector: 'app-contact-card',
	templateUrl: './contact-card.component.html',
	styleUrls: ['./contact-card.component.css', '../../../../../styles/picture.css']
})
export class ContactCardComponent {
	@Input()
	conversation!: Conversation;

	@Input()
	activated!: boolean;

	printTime = printTime;

	pictureIdToUrl(id: string | undefined) {
		return getFirebasePictureUrl(id);
	}

	getTimeBeforeLastMessage() {
		if (!this.conversation.notification)
			return "";
		let time = Math.abs(new Date(this.conversation.notification.date).getTime() - new Date().getTime());
		return this.printTime(time);
	}
}
