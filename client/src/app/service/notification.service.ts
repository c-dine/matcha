import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environment/environment';
import { Observable, map, take } from 'rxjs';
import { ActivityTypes, NotificationWithAuthor, NotificationDto } from '@shared-models/notification.model';
import { ActivitySocketService } from './socket/activitySocket.service';
import { User } from '@shared-models/user.model';
import { UserService } from './user.service';
import { Notification } from '@shared-models/common.models';

@Injectable({
	providedIn: 'root'
})
export class NotificationService {
	route: string = '/notification';
	currentUser!: User | null;


	constructor(
		private http: HttpClient,
		private activitySocket: ActivitySocketService,
		private userService: UserService,

	) {
		this.storeCurrentUser();
	}

	private storeCurrentUser() {
		this.userService.getCurrentUserObs().subscribe({
			next: (user: User | null) =>
				this.currentUser = user
		})
	}

	private postNotification(fromUserId: string, toUserId: string, type: string): Observable<Notification> {
		let notification: NotificationDto = {
			fromUserId: fromUserId,
			toUserId: toUserId,
			type: type
		};
		return this.http.post<Notification>(
			`${environment.apiUrl}${this.route}`, notification
		);
	}

	getNotifications(): Observable<NotificationWithAuthor[]> {
		return this.http.get<NotificationWithAuthor[]>(
			`${environment.apiUrl}${this.route}/notifications`
		);
	}

	sendNewActivity(message: ActivityTypes, toUserId: string) {
		if (!this.currentUser?.id)
			return;
		this.postNotification(this.currentUser?.id, toUserId, message)
			.pipe(take(1)).subscribe({
				next: (ret) => {
					this.activitySocket.newActivity(message, toUserId, ret.id)
				},
			})
	}

	viewNotification(notificationId: string): Observable<NotificationWithAuthor> {
		let body = {
			id: notificationId,
		};
		return this.http.put<NotificationWithAuthor>(
			`${environment.apiUrl}${this.route}/view`, body
		);
	}
}
