import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environment/environment';
import { BehaviorSubject, Observable, firstValueFrom, map, tap } from 'rxjs';
import { GeoCoordinate, ProfileFilters, UserList, User, MapGeoCoordinates, MapUser } from "@shared-models/user.model.js"
import { buildHttpParams } from '../utils/http.utils';

@Injectable({
  providedIn: 'root'
})
export class UserService {

	private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
	private userListFilters = new BehaviorSubject<ProfileFilters>({ batchSize: 8, offset: 0 });

	private geolocationWatchId = -1;

    constructor(
        private http: HttpClient
    ) {	}

	getUserListFiltersObs() {
		return this.userListFilters.asObservable();
	}

	setUserListFilters(filters: ProfileFilters) {
		this.userListFilters.next(filters);
	}

	setCurrentUserSubject(currentUser: User) {
		this.currentUserSubject.next(currentUser);
	}
	
	getCurrentUserObs(): Observable<User | null> {
		if (!this.currentUserSubject.value)
			firstValueFrom(this.getUserProfile());
		return this.currentUserSubject.asObservable();
	}

	getUserProfile(userId?: string): Observable<User | null> {
		const params = userId ? buildHttpParams({ id: userId}) : undefined;
		return this.http.get<User | null>(`${environment.apiUrl}/user/userProfile`, { params })
		.pipe(
			tap(user => {
				if (!userId)
					this.currentUserSubject.next(user);
			})
		);
	}

	getUserList(filters: ProfileFilters): Observable<UserList> {
		const params = buildHttpParams(filters);
		return this.http.get<UserList>(`${environment.apiUrl}/user/userList`, {
			params
		});
	}

	getMapUsers(mapCoordinates: MapGeoCoordinates): Observable<MapUser[]> {
		const params = buildHttpParams(mapCoordinates);
		return this.http.get<MapUser[]>(`${environment.apiUrl}/user/mapUsers`, {
			params
		});
	}

	getMatchingProfiles(filters: ProfileFilters): Observable<UserList> {
		const params = buildHttpParams(filters);
		return this.http.get<UserList>(`${environment.apiUrl}/user/matchingProfiles`, {
			params
		});
	}

	updateUser(updatedUser: User): Observable<User> {
		console.log(updatedUser)
		const currentUser = this.currentUserSubject.value;
		this.currentUserSubject.next({
			...currentUser,
			...updatedUser,
			isProfileFilled: true
		});
		return this.http.put<User>(environment.apiUrl + '/user/', updatedUser);
	}

	async userHasProfile(): Promise<boolean> {
		if (this.currentUserSubject.value === null)
			await firstValueFrom(this.getUserProfile());
		return !!this.currentUserSubject.value?.isProfileFilled;
	}

	// GPS Tracking

	trackUserLocation() {
		if ("geolocation" in navigator && this.geolocationWatchId === -1) {
			this.geolocationWatchId = navigator.geolocation.watchPosition(
				async (position) => {
					await firstValueFrom(this.setTrackingLocation({
						latitude: position.coords.latitude,
						longitude: position.coords.longitude
					}));
				},
				() => firstValueFrom(this.setTrackingLocation())
			);
		}
	}

	setTrackingLocation(location?: GeoCoordinate) {
		if (location && (location.latitude === this.currentUserSubject.value?.location?.latitude &&
			location.longitude === this.currentUserSubject.value?.location.longitude))
			return new Observable(undefined);
		if (location && this.currentUserSubject.value) {
			const currentUser = this.currentUserSubject.value;
			currentUser.location = location;
			this.currentUserSubject.next(currentUser);
		}
		return this.http.post<any>(`${environment.apiUrl}/user/setTrackingLocation`, location);
	}

	stopTrackingLocationChanges() {
		navigator.geolocation.clearWatch(this.geolocationWatchId);
	}

}
