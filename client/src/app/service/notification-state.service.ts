import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, map, take, Subscription } from 'rxjs';
import { NotificationWithAuthor } from '@shared-models/notification.model';
import { ChatService } from './chat.service';
import { ChatSocketService } from './socket/chatSocket.service';
import { NotificationService } from './notification.service';
import { UserService } from './user.service';
import { ActivitySocketService } from './socket/activitySocket.service';
import { UserProfile } from '@shared-models/profile.model';

@Injectable({
	providedIn: 'root'
})
export class NotificationStateService {
	private subscriptions: Subscription[] = [];
	private messagesSubject = new BehaviorSubject<NotificationWithAuthor[]>([]);
	private activitiesSubject = new BehaviorSubject<NotificationWithAuthor[]>([]);

	messages$ = this.messagesSubject.asObservable();
	activities$ = this.activitiesSubject.asObservable();

	constructor(
		private chatSocket: ChatSocketService,
		private activitySocket: ActivitySocketService,
		private userService: UserService,
		private notificationService: NotificationService,
		private chatService: ChatService,
	) {
		this.setupSocketSubscriptions();
	}

	get messages() {
		return this.messagesSubject.value;
	}

	get activities() {
		return this.activitiesSubject.value;
	}

	get notificationsCount() {
		const messagesCount = this.messages.filter((el: NotificationWithAuthor) => !el.notification?.isViewed).length;
		const activitiesCount = this.activities.filter((el: NotificationWithAuthor) => !el.notification?.isViewed).length;
		return messagesCount + activitiesCount;
	}

	initializeNotifications() {
		this.getNotifications();
		this.getConversations();
	}

	private getNotifications() {
		this.notificationService.getNotifications().pipe(take(1)).subscribe({
			next: (response: NotificationWithAuthor[]) => this.activitiesSubject.next(response),
		})
	}

	private getConversations() {
		this.chatService.getConversations().pipe(take(1), map(
			(conversation: NotificationWithAuthor[]) => conversation.map(element => {
				if (element.notification)
					element.notification.message = 'message'
				return element;
			})))
			.subscribe({
				next: (response: NotificationWithAuthor[]) => this.messagesSubject.next(response),
			})
	}

	private setupSocketSubscriptions(): void {
		this.subscribeToSocketMessages();
		this.subscribeToSocketNotifications();
	}

	private subscribeToSocketMessages(): void {
		this.saveSubscription(
			this.chatSocket.getMessages().subscribe(async (socketEvent: any) => {
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
		this.messagesSubject.next([new NotificationWithAuthor(formUserProfile, socketEvent), ...this.messagesSubject.value]);
	}

	private updateExistingConversation(userId: string, socketEvent: any): void {
		const existingConversation = this.messagesSubject.value.find((el: NotificationWithAuthor) => el.author.id === userId);
		if (existingConversation) {
			existingConversation.notification = socketEvent;
		}
	}

	private conversationExist(userId: string | undefined) {
		if (!userId) return false;
		return this.messagesSubject.value.some((el: NotificationWithAuthor) => el.author.id === userId);
	}

	private subscribeToSocketNotifications(): void {
		this.saveSubscription(
			this.activitySocket.getNewActivity().subscribe(async (socketEvent: any) => {
				const formUserProfile =
					await firstValueFrom(this.userService.getUserProfile(socketEvent.fromUserId));
				if (formUserProfile)
					this.activitiesSubject.next([new NotificationWithAuthor(formUserProfile, socketEvent), ...this.activitiesSubject.value]);
			}),
		);
	}

	private saveSubscription(subscription: Subscription): void {
		this.subscriptions.push(subscription);
	}
}
