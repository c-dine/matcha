import { User } from "./user.model";
import { ProfilePicturesIds } from "./picture.model";

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

export class Conversation {
	constructor(
		public firstname: string,
		public lastname: string,
		public last_message: string,
		public latest_date: string,
		public user_id?: string,
		public picturesIds?: ProfilePicturesIds,
	) { }
}
