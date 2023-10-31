import { PoolClient } from "pg";
import { UserModel } from "../../model/user.model.js";
import { GeoCoordinate, ProfileFilters, ProfileFiltersRequest, UserList } from "@shared-models/user.model.js"
import { env } from "../../config/config.js";
import { User } from "@shared-models/user.model.js";

export class UserService {

	dbClient: PoolClient;
	userModel: UserModel;

	constructor(dbClient: PoolClient) {
		this.dbClient = dbClient;
		this.userModel = new UserModel(this.dbClient);
	}

	formatUser(user: user): User {
		return {
			id: user.id,
			lastName: user.last_name,
			firstName: user.first_name,
			username: user.username,
			email: user.email,
			gender: user.gender,
			birthDate: user.birth_date,
			sexualPreferences: user.sexual_preferences,
			biography: user.biography,
			location: user.location_latitude ? {
				latitude: user.location_latitude,
				longitude: user.location_longitude,
			} : undefined,
			userGivenLocation: user.user_given_location_latitude ? {
				latitude: user.user_given_location_latitude,
				longitude: user.user_given_location_longitude
			} : undefined,
			isProfileFilled: user.is_profile_filled
		}
	}

	formatUserFilters(filters: ProfileFiltersRequest): ProfileFilters {
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

	async getUsers(
		whereQuery: { [ key: string ]: any },
		select?: string[]
	) {
		const users = (
			await this.userModel.findMany([whereQuery],
			select
		));
		return users.map(this.formatUser);
	}

	async getUserProfile(currentUserId: string, requestedUserProfileId?: string): Promise<User | undefined> {
		const currentUser = await this.getCurrentUser(currentUserId);
		if (!requestedUserProfileId && !currentUser?.id) return undefined;
		const requestedProfile = 
			await this.userModel.getUserProfile(requestedUserProfileId || currentUser.id, currentUser);
		return {
			...this.formatUser(requestedProfile as user),
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
		const currentUserProfile = await this.getCurrentUser(userId);
		const userlist = await this.userModel.getUserList(filters, currentUserProfile);

		return {
				totalUserCount: (userlist as any)[0]?.total_user_count || 0,
				userList: userlist.map(user => ({
					...this.formatUser(user as user),
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

	async createProfile(newProfile: User, userId: string): Promise<User> {
		const createdProfile = await this.userModel.create({
			gender: newProfile.gender,
			birth_date: newProfile.birthDate,
			sexual_preferences: newProfile.sexualPreferences,
			biography: newProfile.biography,
			user_id: userId,
			location_latitude: newProfile.location.latitude,
			location_longitude: newProfile.location.longitude,
		});

		return this.formatUser(createdProfile);
	}

	async updateProfile(updatedProfileData: User, userId: string): Promise<User> {
		const updatedProfile = await this.userModel.update([{
			user_id: userId
		}], {
			gender: updatedProfileData.gender,
			birth_date: updatedProfileData.birthDate,
			sexual_preferences: updatedProfileData.sexualPreferences,
			biography: updatedProfileData.biography,
			user_given_location_latitude: updatedProfileData.userGivenLocation?.latitude,
			user_given_location_longitude: updatedProfileData.userGivenLocation?.longitude
		});

		return this.formatUser(updatedProfile[0]);
	}

	async setProfileLocation(location: GeoCoordinate, userId: string) {
		return await this.userModel.update([{
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
		const currentUserProfile = await this.getCurrentUser(userId);
		if (!currentUserProfile?.id)
			return undefined;
		const matchingProfiles = 
			await this.userModel.getMatchingProfiles(currentUserProfile, filters);
		return {
			totalUserCount: matchingProfiles.length,
			userList: matchingProfiles.map(user => ({
				...this.formatUser(user as user),
				tags: user.tags?.split(',') || [],
				picturesIds: {
					profilePicture: user.profile_picture_id,
					additionnalPicture: user.additionnal_pictures_ids?.split(',') || []
				},
				ditanceKm: user.distance_km
			}))
		} 
	}

	async getCurrentUser(userId: string): Promise<user | undefined>  {
		return (await this.userModel.findMany([{
			user_id: userId
		}]))[0];
	}
}