import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environment/environment';
import { BehaviorSubject } from 'rxjs';
import { Profile } from "@shared-models/profile.model.js"
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

    constructor(
        private http: HttpClient
    ) {}

	getProfile() {
		return this.http.get<Profile | null>(`${environment.apiUrl}/profile/`);
	}

}
