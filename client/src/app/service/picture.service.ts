import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environment/environment';
import { Observable } from 'rxjs';
import { PresignedPictureUrl } from '@shared-models/picture.model';

@Injectable({
  providedIn: 'root'
})
export class PictureService {

    constructor(
        private http: HttpClient,
    ) {}

	generateMultipleUploadUrl(count = 1): Observable<PresignedPictureUrl[]> {
		return this.http.get<PresignedPictureUrl[]>(
			`${environment.apiUrl}/picture/generateUploadUrl?count=${count}`
		);
	}

}
