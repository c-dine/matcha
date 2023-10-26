import { PoolClient } from "pg";
import { ProfileModel } from "../../model/profile.model.js";
import { Profile, GeoCoordinate, ProfileFilters, ProfileFiltersRequest, UserList, UserProfile } from "@shared-models/profile.model.js"
import { env } from "../../config/config.js";
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
			sexualPreferences: profile.sexual_preferences,
			biography: profile.biography,
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

	async getUserProfile(userId: string, requestedUserProfileId?: string): Promise<UserProfile | undefined> {
		const currentUserProfile = await this.getCurrentUserProfile(userId);
		if (!requestedUserProfileId && !currentUserProfile?.id) return undefined;
		const requestedProfile = 
			await this.profileModel.getUserProfile(requestedUserProfileId || currentUserProfile.id, currentUserProfile);
		return {
			...this.formatProfile(requestedProfile as profile),
			...(new AuthService(this.dbClient)).formatUser(requestedProfile as user),
			tags: requestedProfile.tags?.split(',') || [],
			picturesIds: {
				profilePicture: requestedProfile.profile_picture_id,
				additionnalPicture: requestedProfile.additionnal_pictures_ids?.split(',') || []
			},
			ditanceKm: requestedProfile.distance_km,
			isLiked: requestedProfile.is_liked === null ? undefined : requestedProfile.is_liked,
			likedCurrentUser: requestedProfile.liked_current_user === null ? undefined : requestedProfile.liked_current_user,
			stats: {
				fameRate: Number(requestedProfile.fame_rate),
				matchCount: Number(requestedProfile.match_count),
				likeCount: Number(requestedProfile.like_count),
				dislikeCount: Number(requestedProfile.dislike_count),
				viewCount: Number(requestedProfile.view_count)
			},
		}
	}

	async getUserList(filters: ProfileFilters, userId: string): Promise<UserList> {
		const currentUserProfile = await this.getCurrentUserProfile(userId);
		const userlist = await this.profileModel.getUserList(filters, currentUserProfile);

		return {
				totalUserCount: (userlist as any)[0]?.total_user_count || 0,
				userList: userlist.map(user => ({
					...this.formatProfile(user as profile),
					...(new AuthService(this.dbClient)).formatUser(user as user),
					tags: user.tags?.split(',') || [],
					picturesIds: {
						profilePicture: user.profile_picture_id,
						additionnalPicture: user.additionnal_pictures_ids?.split(',') || []
					},
					ditanceKm: user.distance_km,
					stats: {
						fameRate: user.fame_rate
					}
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

	async updateProfile(updatedProfileData: Profile, userId: string): Promise<Profile> {
		const updatedProfile = await this.profileModel.update([{
			user_id: userId
		}], {
			gender: updatedProfileData.gender,
			birth_date: updatedProfileData.birthDate,
			sexual_preferences: updatedProfileData.sexualPreferences,
			biography: updatedProfileData.biography,
		});

		return this.formatProfile(updatedProfile[0]);
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

	async getMatchingProfiles(userId: string, filters: ProfileFilters): Promise<UserList> {
		const currentUserProfile = await this.getCurrentUserProfile(userId);
		if (!currentUserProfile?.id)
			return undefined;
		const matchingProfiles = 
			await this.profileModel.getMatchingProfiles(currentUserProfile, filters);
		return {
			totalUserCount: matchingProfiles.length,
			userList: matchingProfiles.map(user => ({
				...this.formatProfile(user as profile),
				...(new AuthService(this.dbClient)).formatUser(user as user),
				tags: user.tags?.split(',') || [],
				picturesIds: {
					profilePicture: user.profile_picture_id,
					additionnalPicture: user.additionnal_pictures_ids?.split(',') || []
				},
				ditanceKm: user.distance_km
			}))
		} 
	}

	async getMatchs(userId: string): Promise<UserList> {
		const currentUserProfile = await this.getCurrentUserProfile(userId);
		if (!currentUserProfile?.id)
			return undefined;
		const matchs = 
			await this.profileModel.getMatchs(currentUserProfile);
		return {
			totalUserCount: matchs.length,
			userList: matchs.map(user => ({
				...this.formatProfile(user as profile),
				...(new AuthService(this.dbClient)).formatUser(user as user),
				tags: user.tags?.split(',') || [],
				picturesIds: {
					profilePicture: user.profile_picture_id,
				},
				ditanceKm: user.distance_km
			}))
		} 
	}

	async getCurrentUserProfile(userId: string): Promise<profile | undefined>  {
		return (await this.profileModel.findMany([{
			user_id: userId
		}]))[0];
	}

	async getProfileIdsFromUserIds(userIds: string[]): Promise<profile[] | undefined>  {
		return await this.profileModel.findMany(userIds.map(id => ({
			user_id: id
		})), ["id", "user_id"]);
	}
}