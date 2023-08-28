import { PoolClient } from "pg";
import { ProfileModel } from "../../model/profile.model.js";
import { NewProfile, Profile } from "@shared-models/profile.model.js"

export class ProfileService {

	dbClient: PoolClient;
	
	constructor(dbClient: PoolClient) {
		this.dbClient = dbClient;
	}

	formatProfile(profile: profile): Profile {
		return {
			id: profile.id,
			gender: profile.gender,
			birthDate: profile.birth_date,
			sexualPreferences: profile.sexual_preferences,
			biography: profile.biography
		}
	}

	async getProfile(userId: string): Promise<Profile> {
		const profileModel = new ProfileModel(this.dbClient);
		const profiles = await profileModel.findMany({
			user_id: userId
		}, ["id", "gender", "birth_date", "sexual_preferences", "biography", "location"]);

		return profiles[0] ? this.formatProfile(profiles[0]) : undefined;
	}

	async createProfile(newProfile: NewProfile, userId: string): Promise<Profile> {
		const profileModel = new ProfileModel(this.dbClient);
		const createdProfile = await profileModel.create({
			gender: newProfile.gender,
			birth_date: newProfile.birthDate,
			sexual_preferences: newProfile.sexualPreferences,
			biography: newProfile.biography,
			user_id: userId
		}, ["id", "gender", "birth_date", "sexual_preferences", "biography", "location"]);

		return this.formatProfile(createdProfile);
	}
}