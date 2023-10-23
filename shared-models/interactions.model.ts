import { User } from "./user.model";

export interface Interaction extends Partial<User> {
    profilePicId: string | undefined;
    targetProfileId: string;
    date: Date;
}