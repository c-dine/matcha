interface tag {
	id: string;
	label?: string;
}

interface profile {
	id: string;
	gender?: string;
	birth_date?: Date;
	sexual_preferences?: string;
	biography?: string;
	location_latitude?: number;
	location_longitude?: number;
	fame_rate?: number;
	user_id: string;
}

interface profileTagAssociation {
	profile_id: string;
	tag_id: string;
}

interface picture {
	id: string;
	profile_id: string;
	is_profile_picture: boolean;
	url?: string;
}

interface like {
	id: string;
	user_id: string;
	liked_user_id: string;
	date?: Date;
}

interface view {
	id: string;
	user_id: string;
	viewed_user_id: string;
	date?: Date;
}

interface blacklist {
	id: string;
	user_id: string;
	blacklisted_user_id: string;
	date?: Date;
}

interface fakeReport {
	id: string;
	user_id: string;
	fake_reported_user_id: string;
	date?: Date;
}

interface user {
	id: string;
	username?: string;
	last_name?: string;
	first_name?: string;
	email?: string;
	password?: string;
	verified_account?: boolean;
}

interface message {
	id: string;
	from_user_id: string;
	to_user_id: string;
	message?: string;
	date?: Date;
}

interface notification {
	id: string;
	is_viewed?: boolean;
	from_user_id: string;
	to_user_id: string;
	type?: string;
	date?: Date;
}
