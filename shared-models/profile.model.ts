import { ProfilePicturesIds } from "./picture.model";

export interface Profile {
	id?: string;
    gender: string;
    sexualPreferences: string;
    birthDate: Date;
    biography: string;
	fameRate?: number;
	location?: GeoCoordinate;
	ditanceKm?: number;
	tags?: string[];
	picturesIds?: ProfilePicturesIds;
}

export interface UserProfile extends Profile {
	username: string;
	lastName: string;
	firstName: string;
}

export interface UserList {
	userList: UserProfile[],
	totalUserCount: number
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
	fameRateMin?: number;
	fameRateMax?: number;
	distanceKilometers?: number;
	tags?: string[];
	orderBy?: UserListFilters;
	order?: 'asc' | 'desc';
	batchSize: number;
	offset: number;
}

export const enum UserListFilters {
	age = 'age',
	fame = 'fame',
	distance = 'distance'
}

export interface ProfileFiltersRequest {
	ageMin?: string | undefined;
	ageMax?: string | undefined;
	distanceKilometers?: string | undefined;
	fameRateMin?: string | undefined;
	fameRateMax?: string | undefined;
	tags?: string | undefined;
	orderBy?: UserListFilters;
	order?: 'asc' | 'desc';
	batchSize: string | undefined;
	offset: string | undefined;
}