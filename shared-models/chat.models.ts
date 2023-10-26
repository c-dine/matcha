import { User } from "./user.model";

export interface Message {
	id?: string;
	from: number;
	to: number;
	message: string;
	date: Date;
}

export interface Conversation {
	users: User[],
	lastMessage: Message,
	lastMessageDate: Date,
}