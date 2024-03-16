import { Observable, Observer, Subject } from 'rxjs';
import { inject } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { User } from '@shared-models/user.model';
import { environment } from '@environment/environment';
import { UserService } from '../user.service';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../auth.service';
import { AuthStateService } from '../auth.state';

export class SocketService {
	private userService: UserService;
	private authState: AuthStateService;
	private socket!: Socket;
	private currentUser!: User | undefined;
	private accessToken!: string | undefined;
	private socketDefinedSubject = new Subject<void>();

	constructor(private socketNamespace: string) {
		this.userService = inject(UserService);
		this.authState = inject(AuthStateService);
	}

	private async storeCurrentUser() {
		this.currentUser = (await firstValueFrom(this.userService.getCurrentUserObs())) as User;
	}

	private async storeAccessToken() {
		this.accessToken = this.authState.getAccessToken();
	}

	async connect() {
		if (!this.currentUser) await this.storeCurrentUser();
		if (!this.accessToken) await this.storeAccessToken();
		if (this.socket) return ;
		const socketUrl = `${environment.url}${this.socketNamespace}`;
		this.socket = io(socketUrl, {
			path: environment.socketPath,
			transports: ["polling"],
			query: {
				userId: this.currentUser?.id,
			},
			auth: {
				token: this.accessToken
			}
		});
		this.socketDefinedSubject.next();
	}

	disconnect() {
		if (this.socket)
			this.socket.disconnect();
	}

	emit(event: string, arg: any) {
		arg.fromUserId = this.currentUser?.id;
		this.socket.emit(event, arg);
	}

	on(eventName: string) {
		if (!this.socket) {
			return this.setupSocketDefinedListener(eventName);
		}
		return this.setupSocketListener(eventName);
	}

	private setupSocketDefinedListener(eventName: string): Observable<any> {
		return new Observable<any>((observer) => {
			this.socketDefinedSubject.subscribe({
				next: () => {
					this.socket.on(eventName, (data) => {
						observer.next(data);
					});
				},
			});
		});
	}

	private setupSocketListener(eventName: string): Observable<any> {
		return new Observable<any>((observer) => {
			this.socket.on(eventName, (data) => {
				observer.next(data);
			});
		});
	}
}

