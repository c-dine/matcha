import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environment/environment';
import { Interaction } from '@shared-models/interactions.model';
import { BehaviorSubject, Observable, firstValueFrom, tap } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class BlacklistService {

	private blacklist: BehaviorSubject<Interaction[]> = new BehaviorSubject<Interaction[]>([]);

	constructor(
		private http: HttpClient
	) { 
		firstValueFrom(this.getBlacklist());
	}

	getBlacklistObs(): Observable<Interaction[]> {
		return this.blacklist.asObservable();
	}

	getBlacklist() {
		return this.http.get<Interaction[]>(`${environment.apiUrl}/blacklist/`)
			.pipe(
				tap((blacklist: Interaction[]) => this.blacklist.next(blacklist))
			);
	}

	addBlacklisted(targetUserId: string) {
		return this.http.post<Interaction>(`${environment.apiUrl}/blacklist/`, { targetUserId })
			.pipe(
				tap(blacklisted => {
					const blacklist = this.blacklist.value;
					blacklist.push(blacklisted);
					this.blacklist.next(blacklist);
				})
			);
	}

	deleteBlacklisted(targetUserId: string) {
		let blacklist = this.blacklist.value;
		blacklist = blacklist?.filter((blacklisted) => blacklisted.targetUserId !== targetUserId);
		this.blacklist.next(blacklist);
		return this.http.delete<void>(`${environment.apiUrl}/blacklist/${targetUserId}`);
	}

	isProfileBlocked(userId: string): boolean {
		return !!this.blacklist.value.find((blacklisted) => blacklisted.targetUserId === userId);
	}
}
