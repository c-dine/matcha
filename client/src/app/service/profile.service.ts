import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environment/environment';
import { BehaviorSubject, Observable, firstValueFrom, tap } from 'rxjs';
import { GeoCoordinate, Profile, ProfileFilters, UserList, UserProfile } from "@shared-models/profile.model.js"
import { buildHttpParams } from '../utils/http.utils';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

	private currentUserProfileSubject: BehaviorSubject<Profile | null> = new BehaviorSubject<Profile | null>(null);
	private geolocationWatchId = -1;

	private approximateUserLocationHasBeenSent = false;

    constructor(
        private http: HttpClient
    ) {	}
	
	getCurrentUserProfileObs(): Observable<Profile | null> {
		if (!this.currentUserProfileSubject.value)
			firstValueFrom(this.getCurrentUserProfile());
		return this.currentUserProfileSubject.asObservable();
	}
	
	getUserProfile(userProfileId?: string): Observable<UserProfile | null> {
		const params = userProfileId ? buildHttpParams({ id: userProfileId}) : undefined;
		return this.http.get<UserProfile | null>(`${environment.apiUrl}/profile/userProfile`, { params });
	}

	private getCurrentUserProfile(): Observable<Profile | null> {
		return this.http.get<Profile | null>(`${environment.apiUrl}/profile/`)
			.pipe(
				tap(profile => this.currentUserProfileSubject.next(profile))
			);
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

	getMatchs(): Observable<UserList> {
		return this.http.get<UserList>(`${environment.apiUrl}/profile/matchs`);
	}

	createProfile(newProfile: Profile): Observable<Profile | null> {
		return this.http.post<Profile | null>(`${environment.apiUrl}/profile/`, newProfile)
			.pipe(
				tap(profile => this.currentUserProfileSubject.next(profile))
			);
	}

	updateProfile(updatedProfile: Profile): Observable<Profile> {
		this.currentUserProfileSubject.next(updatedProfile)
		return this.http.put<Profile>(`${environment.apiUrl}/profile/`, updatedProfile);
	}

	async userHasProfile(): Promise<boolean> {
		return !!(await firstValueFrom(this.getCurrentUserProfile()));
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
