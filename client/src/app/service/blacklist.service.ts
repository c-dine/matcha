import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environment/environment';
import { Blacklisted } from '@shared-models/blacklist.model';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class BlacklistService {

	private blacklist: BehaviorSubject<Blacklisted[] | undefined> = new BehaviorSubject<Blacklisted[] | undefined>(undefined);

	constructor(
		private http: HttpClient
	) { }

	getBlacklist() {
		return this.http.get<Blacklisted[]>(`${environment.apiUrl}/blacklist/`)
			.pipe(
				tap((blacklist: Blacklisted[]) => this.blacklist.next(blacklist))
			);
	}

	addBlacklisted(blacklistedUserId: string) {
		let blacklist = this.blacklist.value;
		blacklist?.push({ blacklistedUserId, date: new Date() });
		this.blacklist.next(blacklist);
		return this.http.post<Blacklisted>(`${environment.apiUrl}/blacklist/`, blacklistedUserId);
	}

	deleteBlacklisted(blacklistedUserId: string) {
		let blacklist = this.blacklist.value;
		blacklist = blacklist?.filter((blacklisted) => blacklisted.blacklistedUserId !== blacklistedUserId);
		this.blacklist.next(blacklist);
		return this.http.delete<void>(`${environment.apiUrl}/blacklist/${blacklistedUserId}`);
	}
}
