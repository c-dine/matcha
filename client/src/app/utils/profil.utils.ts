import { Interaction } from "@shared-models/interactions.model";
import { User } from "@shared-models/user.model";

export function getAge(birthDate: Date) {
	return Math.floor((new Date().getTime() - new Date(birthDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
}

export function formatUserProfileToInteraction(user: User): Interaction {
	return {
		profilePicId: user.picturesIds?.profilePicture,
		targetUserId: user.id || "",
		date: new Date(),
		lastName: user.lastName,
		firstName: user.firstName,
		username: user.username
	}
}