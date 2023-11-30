import { Message } from './chat.models';
import { UserProfile } from './profile.model';

export type ActivityTypes = "like" | "unlike" | "dislike" | "view" | "match" | "date" | "date deleted";

export interface Activity {
	id?: string;
	from_user_id: string;
	to_user_id: string;
	message: ActivityTypes;
	date: Date;
	isViewed: boolean;
}

export class NotificationWithAuthor {
	constructor(
		public author: UserProfile,
		public notification?: Activity | Message
	) {}
}

export interface NotificationDto {
	fromUserId: string,
	toUserId: string,
	type: string
}
