import { PoolClient } from "pg";
import { ProfileModel } from "../../model/profile.model.js";
import { Profile } from "@shared-models/profile.model.js"

export class ProfileService {

	dbClient: PoolClient;
	
	constructor(dbClient: PoolClient) {
		this.dbClient = dbClient;
	}

	formatProfile(profile: profile): Profile {
		return {
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
		});

		return profiles[0] ? this.formatProfile(profiles[0]) : undefined;
	}
}