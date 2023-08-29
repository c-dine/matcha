export interface Tag {
	id?: string;
	label: string;
}

export interface ProfileTag {
	profileId?: string;
	tagId?: string;
}

export interface Picture {
	id?: string;
	profileId?: string;
	url?: string;
}

export interface ProfileDefaultPicture {
	profileId?: string;
	pictureId?: string;
}

export interface Like {
	id?: string;
	profileId?: string;
	likedProfileId?: string;
	date?: Date;
}

export interface View {
	id?: string;
	profileId?: string;
	viewedProfileId?: string;
	date?: Date;
}

export interface Blacklist {
	id?: string;
	profileId?: string;
	blacklistedProfileId?: string;
	date?: Date;
}

export interface FakeReport {
	id?: string;
	profileId?: string;
	fakeReportedProfileId?: string;
	date?: Date;
}

export interface User {
	id?: string;
	lastName?: string;
	firstName?: string;
	email?: string;
	password?: string;
	profileId?: string;
}

export interface Message {
	id?: string;
	from: number;
	to: number;
	message: string;
	date: Date;
}

export interface Notification {
	id?: string;
	isViewed?: boolean;
	from?: number;
	to?: number;
	type?: string;
	date?: Date;
}
