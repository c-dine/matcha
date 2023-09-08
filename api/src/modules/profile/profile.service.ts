import { PoolClient } from "pg";
import { ProfileModel } from "../../model/profile.model.js";
import { Profile, GeoCoordinate, ProfileFilters, ProfileFiltersRequest, UserList, UserProfile } from "@shared-models/profile.model.js"
import { env } from "../../config/config.js";
import { TagService } from "../tag/tag.service.js";
import { PictureService } from "../picture/picture.service.js";
import { AuthService } from "../auth/auth.service.js";

export class ProfileService {

	dbClient: PoolClient;
	profileModel: ProfileModel;

	
	constructor(dbClient: PoolClient) {
		this.dbClient = dbClient;
		this.profileModel = new ProfileModel(this.dbClient);
	}

	formatProfile(profile: profile): Profile {
		return {
			id: profile.id,
			gender: profile.gender,
			birthDate: profile.birth_date,
			age: Math.floor((new Date().getTime() - new Date(profile.birth_date).getTime()) / (365.25 * 24 * 60 * 60 * 1000)),
			sexualPreferences: profile.sexual_preferences,
			biography: profile.biography,
			fameRate: profile.fame_rate,
			location: profile.location_latitude ? {
				latitude: profile.location_latitude,
				longitude: profile.location_longitude,
			} : undefined
		}
	}

	formatProfileFilters(filters: ProfileFiltersRequest): ProfileFilters {
		return {
			batchSize: filters.batchSize ? Number(filters.batchSize) : undefined,
			offset: filters.offset ? Number(filters.offset) : undefined,
			ageMax: !!filters.ageMax ? Number(filters.ageMax) : undefined,
			ageMin: !!filters.ageMin ? Number(filters.ageMin) : undefined,
			fameRateMax: !!filters.fameRateMax ? Number(filters.fameRateMax) : undefined,
			fameRateMin: !!filters.fameRateMin ? Number(filters.fameRateMin) : undefined,
			distanceKilometers: !!filters.distanceKilometers ? Number(filters.distanceKilometers) : undefined,
			tags: filters.tags ? (filters.tags as string).split(',') : undefined,
			orderBy: filters.orderBy,
			order: filters.order
		}
	}

	async getUserProfile(userId: string, requestedUserProfileId?: string): Promise<UserProfile> {
		const userProfile = (await this.profileModel.findMany([{
			user_id: userId
		}]))[0];
		const requestedProfile = await this.profileModel.getUserProfile(requestedUserProfileId || userProfile.id, userProfile);
		return {
			...this.formatProfile(requestedProfile as profile),
			birthDate: undefined,
			...(new AuthService(this.dbClient)).formatUser(requestedProfile as user),
			tags: requestedProfile.tags.split(','),
			picturesIds: {
				profilePicture: requestedProfile.profile_picture_id,
				additionnalPicture: requestedProfile.additionnal_pictures_ids?.split(',') || []
			},
			ditanceKm: requestedProfile.distance_km
		}
	}

	async getUserList(filters: ProfileFilters, userId: string): Promise<UserList> {
		const userProfile = (await this.profileModel.findMany([{
			user_id: userId
		}]))[0];
		const userlist = await this.profileModel.getUserList(filters, userProfile);

		return {
				totalUserCount: (userlist as any)[0]?.total_user_count || 0,
				userList: userlist.map(user => ({
					...this.formatProfile(user as profile),
					birthDate: undefined,
					...(new AuthService(this.dbClient)).formatUser(user as user),
					tags: user.tags.split(','),
					picturesIds: {
						profilePicture: user.profile_picture_id,
						additionnalPicture: user.additionnal_pictures_ids?.split(',') || []
					},
					ditanceKm: user.distance_km
				}))
		};
	}

	async createProfile(newProfile: Profile, userId: string): Promise<Profile> {
		const createdProfile = await this.profileModel.create({
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

	async setProfileLocation(location: GeoCoordinate, userId: string) {
		return await this.profileModel.update([{
			user_id: userId
		}], {
			location_latitude: location.latitude,
			location_longitude: location.longitude
		});
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