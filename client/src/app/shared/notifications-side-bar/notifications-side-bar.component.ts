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

@Component({
	selector: 'app-notifications-side-bar',
	templateUrl: './notifications-side-bar.component.html',
	styleUrls: ['./notifications-side-bar.component.css']
})
export class NotificationsSideBarComponent extends SubscriptionBase {
	messages: NotificationWithAuthor[] = [];
	activities: NotificationWithAuthor[] = [];

	constructor(
		private chatSocket: ChatSocketService,
		private activitySocket: ActivitySocketService,
		private userService: UserService,
		private notificationService: NotificationService,
		private chatService: ChatService,
	) {
		super();
		this.setupSocketSubscriptions();
	}

	ngOnInit() {
		this.getNotifications();
		this.getConversations();
	}

	private setupSocketSubscriptions(): void {
		this.subscribeToSocketMessages();
		this.subscribeToSocketNotifications();
	}

	private subscribeToSocketMessages(): void {
		this.saveSubscription(
			this.chatSocket.getMessages().subscribe(async (socketEvent) => {
				await this.handleSocketMessage(socketEvent);
			})
		);
	}

	private async handleSocketMessage(socketEvent: any): Promise<void> {
		const formUserProfile = await this.getUserProfile(socketEvent.fromUserId);
		socketEvent.message = 'message';
		socketEvent.isViewed = false;

		if (formUserProfile) {
			if (!this.conversationExist(formUserProfile.id)) {
				this.addNewConversation(formUserProfile, socketEvent);
			} else {
				if (!formUserProfile.id) return ;
				this.updateExistingConversation(formUserProfile.id, socketEvent);
			}
		}
	}

	private async getUserProfile(userId: string): Promise<UserProfile | null> {
		try {
			return await firstValueFrom(this.userService.getUserProfile(userId));
		} catch (error) {
			console.error('Error fetching user profile', error);
			return null;
		}
	}

	private addNewConversation(formUserProfile: UserProfile, socketEvent: any): void {
		this.messages.unshift(new NotificationWithAuthor(formUserProfile, socketEvent));
	}

	private updateExistingConversation(userId: string, socketEvent: any): void {
		const existingConversation = this.messages.find(el => el.author.id === userId);
		if (existingConversation) {
			existingConversation.notification = socketEvent;
		}
	}

	private conversationExist(userId: string | undefined) {
		if (!userId) return false;
		return this.messages.some(el => el.author.id === userId);
	}

	private subscribeToSocketNotifications(): void {
		this.saveSubscription(
			this.activitySocket.getNewActivity().subscribe(async (socketEvent) => {
				const formUserProfile =
					await firstValueFrom(this.userService.getUserProfile(socketEvent.fromUserId));
				if (formUserProfile)
					this.activities.unshift(new NotificationWithAuthor(formUserProfile, socketEvent));
			}),
		);
	}

	private getNotifications() {
		this.notificationService.getNotifications().pipe(take(1)).subscribe({
			next: (response) => this.activities = response,
		})
	}

	private getConversations() {
		this.chatService.getConversations().pipe(take(1), map(
			(conversation) => conversation.map(element => {
				if (element.notification)
					element.notification.message = 'message'
				return element;
			})))
			.subscribe({
				next: (response) => this.messages = response,
			})
	}
}
