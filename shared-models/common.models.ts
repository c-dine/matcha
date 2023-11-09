export interface Tag {
	id?: string;
	label: string;
}

export interface ProfileTag {
	userId?: string;
	tagId?: string;
}

export interface Picture {
	id?: string;
	userId?: string;
	url?: string;
}

export interface ProfileDefaultPicture {
	userId?: string;
	pictureId?: string;
}

export interface Like {
	id?: string;
	userId?: string;
	likedProfileId?: string;
	date?: Date;
}

export interface View {
	id?: string;
	userId?: string;
	viewedProfileId?: string;
	date?: Date;
}

export interface Blacklist {
	id?: string;
	userId?: string;
	targetUserId?: string;
	date?: Date;
}

export interface FakeReport {
	id?: string;
	userId?: string;
	fakeReportedProfileId?: string;
	date?: Date;
}

export interface User {
	id?: string;
	lastName?: string;
	firstName?: string;
	email?: string;
	password?: string;
	userId?: string;
}

export interface Notification {
	id?: string;
	is_viewed?: boolean;
	from_user_id?: string;
	to_user_id?: string;
	type?: string;
	date?: Date;
}
