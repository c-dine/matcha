import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, firstValueFrom } from 'rxjs';
import { environment } from '@environment/environment';
import { map } from 'rxjs/operators';
import { ProfileService } from './profile.service';
import { User } from '@shared-models/user.model';

@Injectable({
	providedIn: 'root'
})
export class UserService {
	private currentUserSubject: BehaviorSubject<User | undefined> = new BehaviorSubject<User | undefined>(undefined);
	private accessTokenSubject: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);

	geolocationWatchId = -1;

	constructor(
		private http: HttpClient,
		private profileService: ProfileService,
	) { }

	getAccessTokenObs() {
		return this.accessTokenSubject.asObservable();
	}

	getCurrentUserObs() {
		return this.currentUserSubject.asObservable();
	}

	getAccessTokenValue() {
		return this.accessTokenSubject.getValue();
	}

	getCurrentUserValue() {
		return this.currentUserSubject.getValue();
	}

	setAccessTokenObs(token: string | undefined) {
		return this.accessTokenSubject.next(token);
	}

	setCurrentUserObs(user: User) {
		return this.currentUserSubject.next(user);
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
