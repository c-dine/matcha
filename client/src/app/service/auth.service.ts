import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import jwt_decode, { JwtPayload } from 'jwt-decode';
import { AuthenticatedUser, User, NewUser } from '@shared-models/user.model'
import { environment } from '@environment/environment';
import { map, tap } from 'rxjs/operators';
import { ChatSocketService } from './socket/chatSocket.service';
import { ActivitySocketService } from './socket/activitySocket.service';
import { UserService } from './user.service';
import { connectionSocketService } from './socket/connectionSocket.service';
import { ActivatedRoute } from '@angular/router';
import { AuthStateService } from './auth.state';

@Injectable({
	providedIn: 'root'
})
export class AuthService {

	constructor(
		private http: HttpClient,
		private userService: UserService,
		private chatSocket: ChatSocketService,
		private activitySocket: ActivitySocketService,
		private connectionSocket: connectionSocketService,
		private route: ActivatedRoute,
		private authState: AuthStateService
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
		this.authState.setRefreshToken(user.token.refresh || "")
		this.userService.setCurrentUserSubject(user as User);
		this.authState.setAccessToken(user.token.access);
	}

	logout(): void {
		this.http.get<void>(environment.apiUrl + '/auth/logOut')
			.subscribe({
				next: () => {
					this.userService.stopTrackingLocationChanges();
					this.authState.setAccessToken(undefined);
					this.authState.removeRefreshToken();
					this.chatSocket.disconnect();
					this.activitySocket.disconnect();
					this.connectionSocket.disconnect();
					window.location.reload();
				}
			});
	}

	async isLoggedIn(): Promise<boolean> {
		this.checkQueryTokens();
		if (this.isTokenValid(this.authState.getAccessToken())) {
			this.userService.trackUserLocation();
			return true;
		}
		if (this.authState.getRefreshToken() && await firstValueFrom(this.refreshAccessToken())) {
			this.userService.trackUserLocation();
			return true;
		}
		this.authState.setAccessToken(undefined);
		this.authState.removeRefreshToken();
		return false;
	}

	checkQueryTokens() {
		this.route.queryParams.subscribe(params => {
			const accessToken = params['accessToken'];
			const refreshToken = params['refreshToken'];
		
			if (accessToken)
				this.authState.setAccessToken(accessToken);
			if (refreshToken)
				this.authState.setRefreshToken(refreshToken);
		  });
	}

	isTokenValid(token?: string): boolean {
		if (token) {
			const tokenInfo: JwtPayload = jwt_decode(token);
			const currentTime = Date.now() / 1000;
			return tokenInfo.exp !== undefined && tokenInfo.exp > currentTime;
		}
		return false;
	}

	refreshAccessToken() {
		return this.http.post<AuthenticatedUser>(environment.apiUrl + '/auth/refreshAccessToken', { refreshToken: this.authState.getRefreshToken() })
			.pipe(
				tap((authenticatedUser: AuthenticatedUser) => {
					this.authState.setAccessToken(authenticatedUser.token.access);
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

	isConnectedToGoogle() {
		return this.http.get<boolean>(`${environment.apiUrl}/auth/isConnectedWithGoogle`);
	}
}
