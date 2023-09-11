import { environment } from "@environment/environment"

export function getFirebasePictureUrl(pictureId: string | undefined) : string {
	return `${environment.firebaseUrl}${pictureId}?alt=media`;
}