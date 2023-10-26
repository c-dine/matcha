import { User } from "./user.model";

export interface Message {
	id?: string;
	from_user_id: string;
	to_user_id: string;
	message: string;
	date: Date;
}

export interface MessageDto {
	message: string;
}

export interface Conversation {
	firstname: string;
	lastname: string;
	picture_id: string;
	last_message: string;
	latest_date: string;
	profile_id: string;
	user_id: string;
}
