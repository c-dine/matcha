import { PoolClient } from "pg";
import { ProfileModel } from "../../model/profile.model.js";
import { Profile, GeoCoordinate } from "@shared-models/profile.model.js"
import { env } from "../../config/config.js";

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
			biography: profile.biography,
			fameRate: profile.fame_rate
		}
	}

	async getProfile(userId: string): Promise<Profile> {
		const profileModel = new ProfileModel(this.dbClient);
		const profiles = await profileModel.findMany({
			user_id: userId
		});

		return profiles[0] ? this.formatProfile(profiles[0]) : undefined;
	}

	async createProfile(newProfile: Profile, userId: string): Promise<Profile> {
		const profileModel = new ProfileModel(this.dbClient);
		const createdProfile = await profileModel.create({
			gender: newProfile.gender,
			birth_date: newProfile.birthDate,
			sexual_preferences: newProfile.sexualPreferences,
			biography: newProfile.biography,
			user_id: userId,
			location_latitude: newProfile.location.latitude,
			location_longitude: newProfile.location.longitude,
		});

		return this.formatProfile(createdProfile);
	}

	async getLocalhostIpAddress(): Promise<string> {
		return (await fetch("https://api64.ipify.org\?format\=json")
				.then(response => response.json())).ip;
	}

	async getLocationFromIpAddress(ipAddress: string): Promise<GeoCoordinate> {
		try {
			const coordinates = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${env.ipLocationKey}&ip=${ipAddress}`)
				.then(response => response.json());

			return {
				latitude: coordinates.latitude,
				longitude: coordinates.longitude
			}
		} catch (error: any) {
			console.error("Can't locate user.")
		}
	}
}