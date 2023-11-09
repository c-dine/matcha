import { Component, Input } from '@angular/core';
import { getFirebasePictureUrl } from 'src/app/utils/picture.utils';
import { Conversation } from '@shared-models/chat.models';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-chat-match-bar',
  templateUrl: './chat-match-bar.component.html',
  styleUrls: ['./chat-match-bar.component.css', '../../../../../styles/text.css']
})
export class ChatMatchBarComponent {
	@Input()
	matchs!: Conversation[];

	constructor(
		private router: Router,
		private snackBar: MatSnackBar,
	) {}

	pictureIdToPictureUrl(id: string| undefined) {
		return getFirebasePictureUrl(id);
	}

	getProfilePictureUrl(userId: string | undefined): string {
		if(!userId) return "";
		this.snackBar.open(userId, "Close", {
			duration: 4000,
			panelClass: "error-snackbar"
		});
		return getFirebasePictureUrl(userId);
	}

	navigateToUserConversation(userId: string | undefined) {
		if (!userId)
			return ;
		this.router.navigate([`app/chat/${userId}`]);
	}
}
