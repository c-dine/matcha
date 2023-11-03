import { User } from "./user.model";

export interface Interaction extends Partial<User> {
    profilePicId: string | undefined;
    targetUserId: string;
    date: Date;
}