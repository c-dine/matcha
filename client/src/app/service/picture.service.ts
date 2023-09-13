import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environment/environment';
import { Observable, firstValueFrom } from 'rxjs';
import { DisplayableProfilePictures, PresignedPictureUrl, ProfilePicturesIds } from '@shared-models/picture.model';

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

	async uploadAndGetPicturesIds(pictures: DisplayableProfilePictures): Promise<ProfilePicturesIds | undefined> {
		const presignedPictures = await firstValueFrom(this.generateMultipleUploadUrl(pictures.additionnalPictures.length + 1));
		let picturesIds: ProfilePicturesIds = { profilePicture: undefined, additionnalPicture: [] };
		
		try {
			if (pictures.profilePicture?.file)
				await this.uploadPicture(presignedPictures[presignedPictures.length - 1].uploadUrl, pictures.profilePicture?.file);
			picturesIds.profilePicture = pictures.profilePicture ? pictures.profilePicture?.id || presignedPictures[presignedPictures.length - 1].id
				: undefined;
		
			for (let i = 0; i < pictures.additionnalPictures.length; i++) {
				if (pictures.additionnalPictures[i].file)
					await this.uploadPicture(presignedPictures[i].uploadUrl, pictures.additionnalPictures[i].file);
				(picturesIds.additionnalPicture as string[]).push(pictures.additionnalPictures[i].id || presignedPictures[i].id)
			}
		
			return picturesIds;
		} catch (error: any) {
			return undefined;
		}
	}

	private async uploadPicture(uploadUrl: string, file?: File) {
		if (!file) throw new Error();
		await fetch(uploadUrl, {
			method: 'PUT',
			body: file,
			headers: {
				'Content-Type': "image/jpeg",
			}
		});
	}
}
