import { Interaction } from "@shared-models/interactions.model";
import { UserProfile } from "@shared-models/profile.model";

export function getAge(birthDate: Date) {
	return Math.floor((new Date().getTime() - new Date(birthDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
}

export function formatUserProfileToInteraction(profile: UserProfile): Interaction {
	return {
		profilePicId: profile.picturesIds?.profilePicture,
		targetProfileId: profile.id || "",
		date: new Date(),
		lastName: profile.lastName,
		firstName: profile.firstName,
		username: profile.username
	}
}