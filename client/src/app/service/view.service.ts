import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environment/environment';
import { Interaction } from '@shared-models/interactions.model';
import { BehaviorSubject, Observable, firstValueFrom, tap } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ViewService {

	private viewsList: BehaviorSubject<Interaction[]> = new BehaviorSubject<Interaction[]>([]);

	constructor(
		private http: HttpClient
	) { 
		firstValueFrom(this.getViewsList());
	}

	getViewsListObs(): Observable<Interaction[]> {
		return this.viewsList.asObservable();
	}

	getViewsList() {
		return this.http.get<Interaction[]>(`${environment.apiUrl}/view/`)
			.pipe(
				tap((viewsList: Interaction[]) => this.viewsList.next(viewsList))
			);
	}
}
