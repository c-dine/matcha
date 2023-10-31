import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environment/environment';
import { BehaviorSubject, Observable, firstValueFrom, map, tap } from 'rxjs';
import { GeoCoordinate, ProfileFilters, UserList, User } from "@shared-models/user.model.js"
import { buildHttpParams } from '../utils/http.utils';

@Injectable({
  providedIn: 'root'
})
export class UserService {

	private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
	private geolocationWatchId = -1;

	private approximateUserLocationHasBeenSent = false;

    constructor(
        private http: HttpClient
    ) {	}

	setCurrentUserSubject(currentUser: User) {
		this.currentUserSubject.next(currentUser);
	}
	
	getCurrentUserObs(): Observable<User | null> {
		if (!this.currentUserSubject.value)
			firstValueFrom(this.getUserProfile());
		return this.currentUserSubject.asObservable();
	}

	getUserProfile(userProfileId?: string): Observable<User | null> {
		const params = userProfileId ? buildHttpParams({ id: userProfileId}) : undefined;
		return this.http.get<User | null>(`${environment.apiUrl}/profile/userProfile`, { params });
	}

	getUserList(filters: ProfileFilters): Observable<UserList> {
		const params = buildHttpParams(filters);
		return this.http.get<UserList>(`${environment.apiUrl}/profile/userList`, {
			params
		});
	}

	getMatchingProfiles(filters: ProfileFilters): Observable<UserList> {
		const params = buildHttpParams(filters);
		return this.http.get<UserList>(`${environment.apiUrl}/profile/matchingProfiles`, {
			params
		});
	}

	createProfile(newProfile: User): Observable<User | null> {
		return this.http.post<User | null>(`${environment.apiUrl}/profile/`, newProfile)
			.pipe(
				tap(profile => this.currentUserSubject.next(profile))
			);
	}

	updateUser(updatedUser: User): Observable<User> {
		return this.http.put<User>(environment.apiUrl + '/user/', updatedUser)
			.pipe(
				map(user => {
					this.currentUserSubject.next(user);
					return user;
				})
			);
	}

	async userHasProfile(): Promise<boolean> {
		if (this.currentUserSubject.value === null)
			await firstValueFrom(this.getUserProfile());
		return !!this.currentUserSubject.value?.isProfileFilled;
	}

	// GPS Tracking

	trackUserLocation() {
		if (!this.approximateUserLocationHasBeenSent) {
			this.approximateUserLocationHasBeenSent = true;
			firstValueFrom(this.setTrackingLocation());
		}
		if ("geolocation" in navigator && this.geolocationWatchId === -1) {
			this.geolocationWatchId = navigator.geolocation.watchPosition(
				async (position) => {
					await firstValueFrom(this.setTrackingLocation({
						latitude: position.coords.latitude,
						longitude: position.coords.longitude
					}));
				}
			);
		}
	}

	setTrackingLocation(location?: GeoCoordinate) {
		return this.http.post<any>(`${environment.apiUrl}/profile/setTrackingLocation`, location);
	}

	stopTrackingLocationChanges() {
		navigator.geolocation.clearWatch(this.geolocationWatchId);
	}

}
