import { PoolClient } from "pg";
import { ProfileModel } from "../../model/profile.model.js";
import { Profile, GeoCoordinate, ProfileFilters, ProfileFiltersRequest } from "@shared-models/profile.model.js"
import { env } from "../../config/config.js";
import { TagService } from "../tag/tag.service.js";
import { PictureService } from "../picture/picture.service.js";

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

	formatProfileFilters(filters: ProfileFiltersRequest): ProfileFilters {
		return {
			batchSize: filters.batchSize ? Number(filters.batchSize) : undefined,
			offset: filters.offset ? Number(filters.offset) : undefined,
			ageMax: filters.ageMax ? Number(filters.ageMax) : undefined,
			ageMin: filters.ageMin ? Number(filters.ageMin) : undefined,
			fameRateMax: filters.fameRateMax ? Number(filters.fameRateMax) : undefined,
			fameRateMin: filters.fameRateMin ? Number(filters.fameRateMin) : undefined,
			distanceKilometers: filters.distanceKilometers ? Number(filters.distanceKilometers) : undefined,
			tags: filters.tags ? (filters.tags as string).split(',') : undefined
		}
	}

	async getFullProfile(userId: string): Promise<Profile | undefined> {
		try {
			const tagService = new TagService(this.dbClient);
			const pictureService = new PictureService(this.dbClient);
			const profile = await this.getProfile(userId);
			const tags = await tagService.getProfileTags(profile.id);
			const pictures = await pictureService.getProfilePictures(profile.id);

			return {
				...profile,
				picturesIds: pictures,
				tags
			}
		} catch (error: any) {
			return undefined;
		}
	}

	async getProfile(userId: string): Promise<Profile> {
		const profileModel = new ProfileModel(this.dbClient);
		const profiles = await profileModel.findMany([{
			user_id: userId
		}]);

		if (!profiles[0])
			throw new Error();
		return this.formatProfile(profiles[0]);
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