import { Component } from '@angular/core';
import { SubscriptionBase } from '../subscriptionBase/subscription-base.component';
import { ChatSocketService } from 'src/app/service/socket/chatSocket.service';
import { ActivitySocketService } from 'src/app/service/socket/activitySocket.service';
import { NotificationWithAuthor } from '@shared-models/notification.model';
import { UserService } from 'src/app/service/user.service';
import { firstValueFrom, map, take } from 'rxjs';
import { NotificationService } from 'src/app/service/notification.service';
import { ChatService } from 'src/app/service/chat.service';
import { UserProfile } from '@shared-models/profile.model';
import { NotificationStateService } from 'src/app/service/notification-state.service';

@Component({
	selector: 'app-notifications-side-bar',
	templateUrl: './notifications-side-bar.component.html',
	styleUrls: ['./notifications-side-bar.component.css']
})
export class NotificationsSideBarComponent extends SubscriptionBase {
	constructor(
		private notificationStateService: NotificationStateService,
	) { super(); }

	get messages() {
		return this.notificationStateService.messages;
	}

	get activities() {
		return this.notificationStateService.activities;
	}
}
