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
	user_given_location_latitude?: number;
	user_given_location_longitude?: number;
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
	target_profile_id: string;
	date?: Date;
}

interface view {
	id: string;
	user_id: string;
	target_profile_id: string;
	date?: Date;
}

interface blacklist {
	id: string;
	user_id: string;
	target_profile_id: string;
	date?: Date;
}

interface fakeReport {
	id: string;
	user_id: string;
	target_profile_id: string;
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
	from_profile_id: string;
	to_profile_id: string;
	message?: string;
	date?: Date;
}

interface notification {
	id: string;
	is_viewed?: boolean;
	from_profile_id: string;
	to_profile_id: string;
	type?: string;
	date?: Date;
}
