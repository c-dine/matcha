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
	location?: string;
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
	profile_id: string;
	liked_profile_id: string;
	date?: Date;
}

interface view {
	id: string;
	profile_id: string;
	viewed_profile_id: string;
	date?: Date;
}

interface blacklist {
	id: string;
	profile_id: string;
	blacklisted_profile_id: string;
	date?: Date;
}

interface fakeReport {
	id: string;
	profile_id: string;
	fake_reported_profile_id: string;
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
