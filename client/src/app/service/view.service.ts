import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environment/environment';
import { Interaction } from '@shared-models/interactions.model';
import { BehaviorSubject, Observable, firstValueFrom, tap } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ViewService {

	private selfViewsList: BehaviorSubject<Interaction[]> = new BehaviorSubject<Interaction[]>([]);
	private othersViewsList: BehaviorSubject<Interaction[]> = new BehaviorSubject<Interaction[]>([]);

	constructor(
		private http: HttpClient
	) { 
		firstValueFrom(this.getSelfViewsList());
		firstValueFrom(this.getOthersViewsList());
	}

	getSelfViewsListObs(): Observable<Interaction[]> {
		return this.selfViewsList.asObservable();
	}

	getSelfViewsList() {
		return this.http.get<Interaction[]>(`${environment.apiUrl}/view/self`)
			.pipe(
				tap((selfViewsList: Interaction[]) => this.selfViewsList.next(selfViewsList))
			);
	}

	getOthersViewsListObs(): Observable<Interaction[]> {
		return this.othersViewsList.asObservable();
	}

	getOthersViewsList() {
		return this.http.get<Interaction[]>(`${environment.apiUrl}/view/others`)
			.pipe(
				tap((othersViewsList: Interaction[]) => this.othersViewsList.next(othersViewsList))
			);
	}

	async addView(view: Interaction) {
		const selfViewsListCopy = this.selfViewsList.value || [];
		selfViewsListCopy.push(view);
		this.selfViewsList.next(selfViewsListCopy);
	}
}
