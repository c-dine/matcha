import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, firstValueFrom } from 'rxjs';
import jwt_decode, { JwtPayload } from 'jwt-decode';
import { AuthenticatedUser, User, NewUser } from '@shared-models/user.model'
import { environment } from '@environment/environment';
import Cookies from 'js-cookie';
import { map, tap } from 'rxjs/operators';
import { UserService } from './user.service';
import { ChatSocketService } from './socket/chatSocket.service';
import { ActivitySocketService } from './socket/activitySocket.service';
import { ProfileService } from './profile.service';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	constructor(
		private http: HttpClient,
		private userService: UserService,
		private profileService: ProfileService,
		private chatSocket: ChatSocketService,
		private activitySocket: ActivitySocketService,
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
		this.profileService.trackUserLocation();
		this.setRefreshToken(user.token.refresh || "");
		this.userService.setAccessTokenObs(user.token.access);
		this.userService.setCurrentUserObs(user as User);
	}

	logout(): void {
		this.profileService.stopTrackingLocationChanges();
		this.userService.setAccessTokenObs(undefined);
		this.removeRefreshToken();
		this.chatSocket.disconnect();
		this.activitySocket.disconnect();
		window.location.reload();
	}

	async isLoggedIn(): Promise<boolean> {
		if (this.isTokenValid(this.userService.getAccessTokenValue())) {
			this.profileService.trackUserLocation();
			return true;
		}
		if (this.getRefreshToken() && await firstValueFrom(this.refreshAccessToken())) {
			this.profileService.trackUserLocation();
			return true;
		}
		this.userService.setAccessTokenObs(undefined);
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
		return this.userService.getAccessTokenValue();
	}

	refreshAccessToken() {
		return this.http.post<AuthenticatedUser>(environment.apiUrl + '/auth/refreshAccessToken', { refreshToken: this.getRefreshToken() })
			.pipe(
				tap((authenticatedUser: AuthenticatedUser) => {
					this.userService.setAccessTokenObs(authenticatedUser.token.access);
					this.userService.setCurrentUserObs(authenticatedUser as User);
				})
			);
	}
}
