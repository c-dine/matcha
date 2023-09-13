import { environment } from "@environment/environment"

export function getFirebasePictureUrl(pictureId: string | undefined) : string {
	return pictureId ? `${environment.firebaseUrl}${pictureId}?alt=media` : environment.defaultAvatar;
}