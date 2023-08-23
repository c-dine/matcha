import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environment/environment';
import { Observable } from 'rxjs';
import { PresignedPictureUrl } from '@shared-models/picture.model';

export interface DisplayablePicture {
	url?: string,
	file?: File
};
export interface DisplayableProfilePictures {
	profilePicture?: DisplayablePicture
	additionnalPictures: DisplayablePicture[]
};

@Injectable({
  providedIn: 'root'
})
export class PictureService {

    constructor(
        private http: HttpClient,
    ) {}

	generateUploadUrl(): Observable<PresignedPictureUrl> {
		return this.http.get<PresignedPictureUrl>(
			`${environment.apiUrl}/picture/generateUploadUrl`
		);
	}

}
