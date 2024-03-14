import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@shared-models/user.model';
import { getFirebasePictureUrl } from 'src/app/utils/picture.utils';

@Component({
	selector: 'app-chat-message',
	templateUrl: './chat-message.component.html',
	styleUrls: ['./chat-message.component.css', '../../../../../styles/picture.css']
})
export class ChatMessageComponent {
	@Input()
	message!: string;

	@Input()
	user!: User | null;

	@Input()
	isCurrentUser!: boolean;

	getFirebasePictureUrl =  getFirebasePictureUrl;

	constructor(
		private router: Router
	) {}

	navigateToProfile() {
		if (this.user)
			this.router.navigate([`/app/profile`], { queryParams: { id: this.user.id } });
	}
}
