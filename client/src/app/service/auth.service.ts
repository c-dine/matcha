import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import jwt_decode, { JwtPayload } from 'jwt-decode';
import { AuthenticatedUser, User, NewUser } from '@shared-models/user.model'
import { environment } from '@environment/environment';
import Cookies from 'js-cookie';
import { map, tap } from 'rxjs/operators';
import { ChatSocketService } from './socket/chatSocket.service';
import { ActivitySocketService } from './socket/activitySocket.service';
import { UserService } from './user.service';
import { connectionSocketService } from './socket/connectionSocket.service';

@Injectable({
	providedIn: 'root'
})
export class AuthService {

	private accessTokenSubject: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);

	constructor(
		private http: HttpClient,
		private userService: UserService,
		private chatSocket: ChatSocketService,
		private activitySocket: ActivitySocketService,
		private connectionSocket: connectionSocketService,
	) { }

	signIn(newUser: NewUser): Observable<AuthenticatedUser> {
		return this.http.post<AuthenticatedUser>(environment.apiUrl + '/auth/signIn', newUser)
			.pipe(
				map(user => {
					this.setSession(user);
					return user;
				})
			);
	}

	login(userAuthData: { username: string, password: string }): Observable<AuthenticatedUser> {
		return this.http.post<AuthenticatedUser>(environment.apiUrl + '/auth/logIn', userAuthData)
			.pipe(
				map(user => {
					this.setSession(user as AuthenticatedUser);
					return user;
				})
			);
	}

	setSession(user: AuthenticatedUser) {
		this.userService.trackUserLocation();
		this.setRefreshToken(user.token.refresh || "");
		this.userService.setCurrentUserSubject(user as User);
		this.accessTokenSubject.next(user.token.access);
	}

	logout(): void {
		this.userService.stopTrackingLocationChanges();
		this.accessTokenSubject.next(undefined);
		this.removeRefreshToken();
		this.chatSocket.disconnect();
		this.activitySocket.disconnect();
		this.connectionSocket.disconnect();
		window.location.reload();
	}

	async isLoggedIn(): Promise<boolean> {
		if (this.isTokenValid(this.accessTokenSubject.value)) {
			this.userService.trackUserLocation();
			return true;
		}
		if (this.getRefreshToken() && await firstValueFrom(this.refreshAccessToken())) {
			this.userService.trackUserLocation();
			return true;
		}
		this.accessTokenSubject.next(undefined);
		this.removeRefreshToken();
		return false;
	}

	isTokenValid(token?: string): boolean {
		if (token) {
			const tokenInfo: JwtPayload = jwt_decode(token);
			const currentTime = Date.now() / 1000;
			return tokenInfo.exp !== undefined && tokenInfo.exp > currentTime;
		}
		return false;
	}

	setRefreshToken(token: string) {
		Cookies.set("refreshToken", token);
	}

	removeRefreshToken() {
		Cookies.remove("refreshToken");
	}

	getRefreshToken(): string | undefined {
		return Cookies.get("refreshToken");
	}

	getAccessToken(): string | undefined {
		return this.accessTokenSubject.value;
	}

	refreshAccessToken() {
		return this.http.post<AuthenticatedUser>(environment.apiUrl + '/auth/refreshAccessToken', { refreshToken: this.getRefreshToken() })
			.pipe(
				tap((authenticatedUser: AuthenticatedUser) => {
					this.accessTokenSubject.next(authenticatedUser.token.access);
					this.userService.setCurrentUserSubject(authenticatedUser as User);
				})
			);
	}

	updatePassword(lastPassword: string, newPassword: string): Observable<void> {
		return this.http.put<void>(environment.apiUrl + '/auth/updatePassword', {
			lastPassword,
			newPassword
		});
	}

	resetPassword(resetToken: string, password: string) {
		return this.http.post<string>(environment.apiUrl + '/auth/resetPassword', {
			resetToken,
			password
		});
	}

	verifyEmail(verificationToken: string) {
		return this.http.post<string>(environment.apiUrl + '/auth/verifyEmail', {
			verificationToken
		});
	}
}
