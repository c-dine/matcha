import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environment/environment';
import { Event } from '@shared-models/interactions.model';
import { buildHttpParams } from '../utils/http.utils';

@Injectable({
	providedIn: 'root'
})
export class EventService {

	constructor(
		private http: HttpClient
	) { }

	getEvents(start: Date, end: Date) {
		const params = buildHttpParams({ start, end });
		return this.http.get<Event[]>(`${environment.apiUrl}/event`, {
			params
		});
	}

	addEvent(event: Event) {
		console.log("ok")
		return this.http.post<Event>(`${environment.apiUrl}/event/`, { event });
	}

	deleteEvent(eventId: string) {
		return this.http.delete<void>(`${environment.apiUrl}/event/${eventId}`);
	}
}
