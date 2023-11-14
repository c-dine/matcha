import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationWithAuthor } from '@shared-models/notification.model';
import { User } from '@shared-models/user.model';
import { take } from 'rxjs';
import { ChatService } from 'src/app/service/chat.service';
import { NotificationService } from 'src/app/service/notification.service';
import { UserService } from 'src/app/service/user.service';
import { getFirebasePictureUrl } from 'src/app/utils/picture.utils';
import { printTime } from 'src/app/utils/timePrinter.utils';

@Component({
	selector: 'app-notification-card',
	templateUrl: './notification-card.component.html',
	styleUrls: ['./notification-card.component.css']
})
export class NotificationCardComponent {
	currentUser!: User | null;
	getFirebasePictureUrl = getFirebasePictureUrl;
	printTime = printTime;

	@Input()
	notification!: NotificationWithAuthor;

	constructor(
		private router: Router,
		private notificationService: NotificationService,
		private chatService: ChatService,
		private userService: UserService,
	) {
		this.userService.getCurrentUserObs().subscribe({
			next: (currentUser) => this.currentUser = currentUser,
		})
	}

	getNotificationTime() {
		if (!this.notification.notification)
			return "";
		let intervalNowNotif = Math.abs(new Date(this.notification.notification.date).getTime() - new Date().getTime());
		return printTime(intervalNowNotif);
	}

	navigateToNotification(userId: string | undefined) {
		if (!userId) return;
		if (this.notification.notification?.message !== 'message')
			this.router.navigate([`/app/profile`], { queryParams: { id: userId } });
		else
			this.router.navigate([`/app/chat/${userId}`]);
	}

	viewNotification() {
		if (this.notification.notification?.message !== 'message')
			this.addNotificationView();
		else
			this.addMessageView();
	}

	addNotificationView() {
		if (!this.notification.notification?.id || this.notification.notification.isViewed) return;
		this.notificationService.viewNotification(this.notification.notification.id)
		.pipe(take(1)).subscribe({
			next: () => {
				if (!this.notification.notification) return ; 
				this.notification.notification.isViewed = true
			}
		});
	}

	addMessageView() {
		if (!this.notification.notification?.id
			|| this.notification.notification.isViewed
			|| this.notification.notification.from_user_id === this.currentUser?.id)
			return;
		this.chatService.viewMessage(this.notification.notification.id)
		.pipe(take(1)).subscribe({
			next: () => {
				if (!this.notification.notification) return ; 
				this.notification.notification.isViewed = true
			}
		});
	}

	isNotificationViewed() {
		if (this.notification.notification?.message !== 'message')
			return this.notification.notification?.isViewed;
		else {
			return this.notification.notification?.isViewed
			|| this.notification.notification.from_user_id === this.currentUser?.id;
		}
	}
}
