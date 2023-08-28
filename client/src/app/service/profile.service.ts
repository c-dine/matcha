import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environment/environment';
import { Subject, firstValueFrom, tap } from 'rxjs';
import { NewProfile, Profile } from "@shared-models/profile.model.js"

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

	private profileSubject: Subject<Profile | null> = new Subject<Profile | null>();

    constructor(
        private http: HttpClient
    ) {}

	private getProfile() {
		return this.http.get<Profile | null>(`${environment.apiUrl}/profile/`)
			.pipe(
				tap(profile => this.profileSubject.next(profile))
			);
	}

	createProfile(newProfile: NewProfile) {
		return this.http.post<Profile | null>(`${environment.apiUrl}/profile/`, newProfile)
			.pipe(
				tap(profile => this.profileSubject.next(profile))
			);
	}

	getProfileObs() {
		return this.profileSubject.asObservable();
	}

	async userHasProfile(): Promise<boolean> {
		return !!(await firstValueFrom(this.getProfile()));
	}

}
