import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, firstValueFrom } from 'rxjs';
import jwt_decode, { JwtPayload } from 'jwt-decode';
import { AuthenticatedUser, User, NewUser } from '@shared-models/user.model'
import { environment } from '@environment/environment';
import Cookies from 'js-cookie';
import { map, tap } from 'rxjs/operators';
import { ProfileService } from './profile.service';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
	private currentUserSubject: BehaviorSubject<User | undefined> = new BehaviorSubject<User | undefined>(undefined);
	private accessTokenSubject: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);

	geolocationWatchId = -1;

    constructor(
        private http: HttpClient,
        private router: Router,
		private profileService: ProfileService
    ) {}

	getAccessTokenObs() {
		return this.accessTokenSubject.asObservable();
	}
	
	getCurrentUserObs() {
		return this.currentUserSubject.asObservable();
	}

	signIn(newUser: NewUser): Observable<AuthenticatedUser>  {
		return this.http.post<AuthenticatedUser>(environment.apiUrl + '/auth/signIn', newUser)
			.pipe(
				map(user => {
					this.setSession(user);
					this.trackUserLocation();
					return user;
				})
			);
	}

    login(userAuthData: { username: string, password: string }): Observable<AuthenticatedUser> {
		return this.http.post<AuthenticatedUser>(environment.apiUrl + '/auth/logIn', userAuthData)
			.pipe(
				map(user => {
					this.setSession(user as AuthenticatedUser);
					this.trackUserLocation();
					return user;
				})
			);
    }

	updateUser(updatedUser: User): Observable<User> {
		return this.http.put<User>(environment.apiUrl + '/auth/', updatedUser)
			.pipe(
				map(user => {
					this.currentUserSubject.next(user);
					return user;
				})
			);
	}

	updatePassword(lastPassword: string, newPassword: string): Observable<void> {
		return this.http.put<void>(environment.apiUrl + '/auth/updatePassword', {
			lastPassword,
			newPassword
		});
	}

	setSession(user: AuthenticatedUser) {
		this.setRefreshToken(user.token.refresh || "");
		this.accessTokenSubject.next(user.token.access);
		this.currentUserSubject.next(user as User);
	}

  	logout(): void {
		this.stopTrackingLocationChanges();
		this.accessTokenSubject.next(undefined);
		this.removeRefreshToken();
		window.location.reload();
	}

  	async isLoggedIn(): Promise<boolean> {
		if (this.isTokenValid(this.accessTokenSubject.getValue()))
			return true;
		if (this.getRefreshToken() && await firstValueFrom(this.refreshAccessToken()))
			return true;
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
		return this.accessTokenSubject.getValue();
	}

	refreshAccessToken() {
        return this.http.post<AuthenticatedUser>(environment.apiUrl + '/auth/refreshAccessToken', { refreshToken: this.getRefreshToken() })
			.pipe(
				tap((authenticatedUser: AuthenticatedUser) => {
					this.accessTokenSubject.next(authenticatedUser.token.access);
					this.currentUserSubject.next(authenticatedUser as User);
				})
			);
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

	trackUserLocation() {
		if ("geolocation" in navigator) {
			this.geolocationWatchId = navigator.geolocation.watchPosition(
				async (position) => {
					await firstValueFrom(this.profileService.setLocation({
						latitude: position.coords.latitude,
						longitude: position.coords.longitude
					}));
				}
			);
		}
	}

	stopTrackingLocationChanges() {
		navigator.geolocation.clearWatch(this.geolocationWatchId);
	}
}
