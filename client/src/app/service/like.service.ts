import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environment/environment';
import { Interaction } from '@shared-models/interactions.model';
import { BehaviorSubject, Observable, firstValueFrom, tap } from 'rxjs';
import { formatUserProfileToInteraction } from '../utils/profil.utils';
import { User } from '@shared-models/user.model';

@Injectable({
	providedIn: 'root'
})
export class LikeService {

	private selfLikesList: BehaviorSubject<Interaction[]> = new BehaviorSubject<Interaction[]>([]);
	private othersLikesList: BehaviorSubject<Interaction[]> = new BehaviorSubject<Interaction[]>([]);

	constructor(
		private http: HttpClient
	) {
		firstValueFrom(this.getSelfLikesList());
		firstValueFrom(this.getOthersLikesList());
	}

	getSelfLikesListObs(): Observable<Interaction[]> {
		return this.selfLikesList.asObservable();
	}

	getSelfLikesList() {
		return this.http.get<Interaction[]>(`${environment.apiUrl}/like/self`)
			.pipe(
				tap((selfLikesList: Interaction[]) => this.selfLikesList.next(selfLikesList))
			);
	}

	getOthersLikesListObs(): Observable<Interaction[]> {
		return this.othersLikesList.asObservable();
	}

	getOthersLikesList() {
		return this.http.get<Interaction[]>(`${environment.apiUrl}/like/others`)
			.pipe(
				tap((othersLikesList: Interaction[]) => this.othersLikesList.next(othersLikesList))
			);
	}

	likeProfile(profile: User) {
		const selfLikesList = this.selfLikesList.value;
		selfLikesList.push(formatUserProfileToInteraction(profile));
		this.selfLikesList.next(selfLikesList);
		return this.http.post<void>(`${environment.apiUrl}/like/`, {
			targetUserId: profile.id,
			isLiked: true
		});
	}																

	dislikeProfile(targetUserId: string) {
		return this.http.post<void>(`${environment.apiUrl}/like/`, {
			targetUserId
		});
	}

	unlikeProfile(targetUserId: string) {
		return this.http.delete<void>(`${environment.apiUrl}/like/${targetUserId}`);
	}
}
