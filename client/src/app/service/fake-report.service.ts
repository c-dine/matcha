import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environment/environment';
import { Interaction } from '@shared-models/interactions.model';
import { BehaviorSubject, Observable, firstValueFrom, tap } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class FakeReportService {

	private fakeReportList: BehaviorSubject<Interaction[]> = new BehaviorSubject<Interaction[]>([]);

	constructor(
		private http: HttpClient
	) { 
		firstValueFrom(this.getFakeReportList());
	}

	getFakeReportListObs(): Observable<Interaction[]> {
		return this.fakeReportList.asObservable();
	}

	getFakeReportList() {
		return this.http.get<Interaction[]>(`${environment.apiUrl}/fakeReport/`)
			.pipe(
				tap((fakeReportList: Interaction[]) => this.fakeReportList.next(fakeReportList))
			);
	}

	addFakeReported(targetProfileId: string) {
		return this.http.post<Interaction>(`${environment.apiUrl}/fakeReport/`, { targetProfileId })
			.pipe(
				tap(fakeReportListed => {
					const fakeReportList = this.fakeReportList.value;
					fakeReportList.push(fakeReportListed);
					this.fakeReportList.next(fakeReportList);
				})
			);
	}

	deleteFakeReported(targetProfileId: string) {
		let fakeReportList = this.fakeReportList.value;
		fakeReportList = fakeReportList?.filter((fakeReportListed) => fakeReportListed.targetProfileId !== targetProfileId);
		this.fakeReportList.next(fakeReportList);
		return this.http.delete<void>(`${environment.apiUrl}/fakeReport/${targetProfileId}`);
	}

	isProfileReported(userId: string): boolean {
		return !!this.fakeReportList.value.find((report) => report.targetProfileId === userId);
	}
}
