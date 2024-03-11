export interface PresignedPictureUrl {
	id: string,
	uploadUrl: string;
}

export interface DisplayablePicture {
	id?: string,
	url?: string,
	file?: File
};

export interface DisplayableProfilePictures {
	profilePicture?: DisplayablePicture,
	additionnalPictures: DisplayablePicture[]
};

export interface ProfilePicturesIds {
	profilePicture?: string,
	additionnalPicture?: string[]
}

export interface GoogleMediaItem {
	"id": string,
	"description": string,
	"productUrl": string,
	"baseUrl": string,
	"mimeType": string,
	"mediaMetadata": {
		"creationTime": string,
		"width": string,
		"height": string,
		"photo": {
		  "cameraMake": string,
		  "cameraModel": string,
		  "focalLength": number,
		  "apertureFNumber": number,
		  "isoEquivalent": number,
		  "exposureTime": string
		}
	},
	"contributorInfo": {
		"profilePictureBaseUrl": string,
		"displayName": string
	},
	"filename": string
}