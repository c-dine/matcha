import { environment } from "@environment/environment"
import { ProfilePicturesIds } from "@shared-models/picture.model";

export function getFirebasePictureUrl(pictureId: string | undefined) : string {
	return pictureId ? `${environment.firebaseUrl}${pictureId}?alt=media` : environment.defaultAvatar;
}

export function picturesIdsToPicturesUrls(picturesIds: ProfilePicturesIds | undefined): string[] {
	let picturesUrl: string[] = [];

	if (picturesIds === undefined)
		return picturesUrl;
	picturesUrl.push(getFirebasePictureUrl(picturesIds.profilePicture));
	picturesIds.additionnalPicture?.forEach((pictureId: string) => {
		picturesUrl.push(getFirebasePictureUrl(pictureId))
	});
	return picturesUrl;
}