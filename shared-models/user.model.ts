import { ProfilePicturesIds } from "./picture.model";

export interface User {
	id?: string;
	lastName: string;
	firstName: string;
	email?: string;
	username: string;
	
    gender: string;
    sexualPreferences: string;
    birthDate: Date;
    biography: string;
	location?: GeoCoordinate;
	userGivenLocation?: GeoCoordinate;
	ditanceKm?: number;
	tags?: string[];
	picturesIds?: ProfilePicturesIds;
	stats?: ProfileStats;
	isProfileFilled?: boolean;
	verifiedAccount?: boolean;

	isLiked?: boolean;
	likedCurrentUser?: boolean;
}

export interface AuthenticatedUser extends User {
	token: {
		refresh?: string,
		access: string
	}
}

export interface MapUser {
	id: string,
	location: GeoCoordinate,
	username: string,
	fameRate: number,
	pictureId: string
}

export interface NewUser extends Partial<User> {
	password: string
}

export interface UserList {
	userList: User[],
	totalUserCount: number
}

export interface NavbarProfile {
	firstName?: string;
	lastName?: string;
	username?: string;
	profilePictureUrl?: string;
	likesNb?: number;
	matchsNb?: number;
	fameRate?: number;
}

export interface GeoCoordinate {
	latitude: number;
	longitude: number;
}

export interface MapGeoCoordinates {
	topLatitude: number,
	bottomLatitude: number,
	rightLongitude: number,
	leftLongitude: number
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

export interface ProfileStats {
	likeCount?: number;
	dislikeCount?: number;
	fameRate?: number;
	viewCount?: number;
	matchCount?: number;
}