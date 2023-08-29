import { ProfilePicturesIds } from "./picture.model";

export interface Profile {
	id?: string;
    gender: string;
    sexualPreferences: string;
    birthDate: Date;
    biography: string;
	fameRate?: number;
	location?: GeoCoordinate;
	tags?: string[];
	picturesIds?: ProfilePicturesIds;
}

export interface GeoCoordinate {
	latitude: number;
	longitude: number;
}