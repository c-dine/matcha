interface tag {
	id: string;
	label?: string;
}

interface profileTagAssociation {
	user_id: string;
	tag_id: string;
}

interface picture {
	id: string;
	user_id: string;
	is_profile_picture: boolean;
	url?: string;
}

interface like {
	id: string;
	user_id: string;
	target_user_id: string;
	date?: Date;
}

interface view {
	id: string;
	user_id: string;
	target_user_id: string;
	date?: Date;
}

interface blacklist {
	id: string;
	user_id: string;
	target_user_id: string;
	date?: Date;
}

interface fakeReport {
	id: string;
	user_id: string;
	target_user_id: string;
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

	gender?: string;
	birth_date?: Date;
	sexual_preferences?: string;
	biography?: string;
	location_latitude?: number;
	location_longitude?: number;
	fame_rate?: number;
	user_given_location_latitude?: number;
	user_given_location_longitude?: number;
	is_profile_filled?: boolean;
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

interface event {
	id: string,
	user_id: string,
	target_user_id: string,
	date: Date,
	title: string,
	start_date: Date,
	end_date: Date,
	location: string
}