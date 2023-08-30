import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '@environment/environment';
import { BehaviorSubject, filter, firstValueFrom, tap } from 'rxjs';
import { Profile, ProfileFilters } from "@shared-models/profile.model.js"
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

	getProfileObs() {
		return this.profileSubject.asObservable();
	}

	getUserList(filters: ProfileFilters) {
		const params = buildHttpParams(filters);
		return this.http.get<Profile[]>(`${environment.apiUrl}/profile/userList`, {
			params
		});
	}

	async userHasProfile(): Promise<boolean> {
		return !!(await firstValueFrom(this.getProfile()));
	}

}
