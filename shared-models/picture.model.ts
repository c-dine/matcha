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