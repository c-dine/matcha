import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environment/environment';
import { BehaviorSubject, firstValueFrom, tap } from 'rxjs';
import { GeoCoordinate, Profile, ProfileFilters, UserList } from "@shared-models/profile.model.js"
import { buildHttpParams } from '../utils/http.utils';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

	private profileSubject: BehaviorSubject<Profile | null> = new BehaviorSubject<Profile | null>(null);

    constructor(
        private http: HttpClient
    ) {}

	private getProfile() {
		return this.http.get<Profile | null>(`${environment.apiUrl}/profile/`)
			.pipe(
				tap(profile => this.profileSubject.next(profile))
			);
	}

	createProfile(newProfile: Profile) {
		return this.http.post<Profile | null>(`${environment.apiUrl}/profile/`, newProfile)
			.pipe(
				tap(profile => this.profileSubject.next(profile))
			);
	}

	setLocation(location: GeoCoordinate) {
		return this.http.post<any>(`${environment.apiUrl}/profile/setLocation`, location);
	}

	getProfileObs() {
		return this.profileSubject.asObservable();
	}

	getUserList(filters: ProfileFilters) {
		const params = buildHttpParams(filters);
		return this.http.get<UserList>(`${environment.apiUrl}/profile/userList`, {
			params
		});
	}

	async userHasProfile(): Promise<boolean> {
		return !!(await firstValueFrom(this.getProfile()));
	}

}
