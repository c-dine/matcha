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
	username?: string;
}

export interface NavbarProfile {
	firstName?: string;
	lastName?: string;
	username?: string;
	profilePictureUrl?: string;
	likesNb?: number;
	matchesNb?: number;
	fameRate?: number;
}

export interface GeoCoordinate {
	latitude: number;
	longitude: number;
}

export interface ProfileFilters {
	ageMin?: number;
	ageMax?: number;
	distanceKilometers?: number;
	fameRateMin?: number;
	fameRateMax?: number;
	tags?: string[];
	batchSize: number;
	offset: number;
}

export interface ProfileFiltersRequest {
	ageMin?: string;
	ageMax?: string;
	distanceKilometers?: string;
	fameRateMin?: string;
	fameRateMax?: string;
	tags?: string;
	batchSize: string;
	offset: string;
}