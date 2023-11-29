import { NotificationWithAuthor } from "./notification.model";

export interface Message {
	id?: string;
	from_user_id: string;
	to_user_id: string;
	message: string;
	date: Date;
	isViewed: boolean;
}

export interface MessageDto {
	message: string;
}

export interface Conversation extends NotificationWithAuthor{
}
