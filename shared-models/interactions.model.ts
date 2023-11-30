import { User } from "./user.model";

export interface Interaction extends Partial<User> {
    profilePicId: string | undefined;
    targetUserId: string;
    date: Date;
}

export interface Event extends Interaction {
	id?: string,
	start?: Date,
	end?: Date,
	title?: string,
	eventLocation?: string
}