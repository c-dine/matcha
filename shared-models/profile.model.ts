import { ProfilePicturesIds } from "./picture.model";

export interface Profile {
	id?: string;
    gender: string;
    sexualPreferences: string;
    birthDate: Date;
    biography: string;
}

export interface NewProfile extends Profile {
	tags: string[],
	picturesIds: ProfilePicturesIds,
	location?: GeoCoordinate
}

export interface GeoCoordinate {
	latitude: number,
	longitude: number
}