import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environment/environment';
import { Interaction } from '@shared-models/interactions.model';
import { BehaviorSubject, Observable, firstValueFrom, tap } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class LikeService {

	constructor(
		private http: HttpClient
	) { }

	likeProfile(targetProfileId: string) {
		return this.http.post<void>(`${environment.apiUrl}/like/`, {
			targetProfileId,
			isLiked: true
		});
	}																

	dislikeProfile(targetProfileId: string) {
		return this.http.post<void>(`${environment.apiUrl}/like/`, {
			targetProfileId
		});
	}

	unlikeProfile(targetProfileId: string) {
		return this.http.delete<void>(`${environment.apiUrl}/like/${targetProfileId}`);
	}
}
