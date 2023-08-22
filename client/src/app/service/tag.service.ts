import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environment/environment';
import { Tag } from "@shared-models/common.models"

@Injectable({
	providedIn: 'root'
})
export class TagService {

	constructor(
		private http: HttpClient
	) { }

	getTags() {
		return this.http.get<Tag[]>(`${environment.apiUrl}/tag/`);
	}
}
