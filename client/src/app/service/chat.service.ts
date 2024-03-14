import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environment/environment';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import { User } from '@shared-models/user.model';
import { Conversation, Message, MessageDto } from '@shared-models/chat.models';
import { NotificationWithAuthor } from '@shared-models/notification.model';

@Injectable({
	providedIn: 'root'
})
export class ChatService {
	currentUser!: User | null;
	route: string = '/chat';

	constructor(
		private http: HttpClient,
		private userService: UserService
	) {}

	ngOnInit() {
		this.storeCurrentUser();
	}

	private storeCurrentUser() {
		this.userService.getCurrentUserObs().subscribe({
			next: (user: User | null) =>
				this.currentUser = user
		})
	}

	sendMessage(toUserId: string, messageText: string): Observable<Message> {
		let message: MessageDto = {
			message: messageText
		};
		return this.http.post<Message>(
			`${environment.apiUrl}${this.route}/message/${toUserId}`, message
		);
	}

	getMessages(toUserId: string | undefined): Observable<Message[]> {
		if (toUserId === undefined)				//Verifier ca
			return new Observable<Message[]>();				//Verifier ca
		return this.http.get<Message[]>(
			`${environment.apiUrl}${this.route}/messages/${toUserId}`
		);
	}

	getConversations(): Observable<Conversation[]> {
		return this.http.get<Conversation[]>(
			`${environment.apiUrl}${this.route}/conversations`
		);
	}

	viewMessage(messageId: string): Observable<NotificationWithAuthor> {
		let body = {
			id: messageId,
		};
		return this.http.put<NotificationWithAuthor>(
			`${environment.apiUrl}${this.route}/view`, body
		);
	}
}
