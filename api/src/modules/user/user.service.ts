import { PoolClient } from "pg";
import { UserModel } from "../../model/user.model.js";
import { GeoCoordinate, MapGeoCoordinates, MapUser, ProfileFilters, ProfileFiltersRequest, UserList } from "@shared-models/user.model.js"
import { env } from "../../config/config.js";
import { User } from "@shared-models/user.model.js";
import { Conversation } from "@shared-models/chat.models.js";

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

	async getUserById(userId: string): Promise<user | undefined>  {
		return (await this.userModel.findMany([{
			id: userId
		}]))[0];
	}

	async getUsers(
		whereQuery: { [ key: string ]: any }[],
		select?: string[]
	) {
		const users = (
			await this.userModel.findMany(whereQuery,
			select
		));
		return users.map(this.formatUser);
	}

	async  getFullProfile(currentUserId: string, requestedUserId?: string): Promise<User | undefined> {
		const currentUser = await this.getUserById(currentUserId);
		if (!requestedUserId && !currentUser?.id) return undefined;
		const requestedProfile = 
			await this.userModel.getFullProfile(requestedUserId || currentUser.id, currentUser);
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
		const currentUserProfile = await this.getUserById(userId);
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
					},
					isLiked: user.is_liked === null ? undefined : user.is_liked,
					likedCurrentUser: user.liked_current_user === null ? undefined : user.liked_current_user,
				}))
		};
	}

	async getMapList(mapCoordinates: MapGeoCoordinates, userId: string) {
		const currentUserProfile = await this.getUserById(userId);
		const users = await this.userModel.getMapUsers(mapCoordinates, currentUserProfile);
		return users.map(user => ({
			id: user.id,
			location: {
				latitude: user.user_given_location_latitude ? user.user_given_location_latitude : user.location_latitude,
				longitude: user.user_given_location_longitude ? user.user_given_location_longitude : user.location_longitude
			},
			username: user.username,
			fameRate: user.fame_rate,
			pictureId: user.picture_id
		} as MapUser));
	}

	async getMatchingProfiles(userId: string, filters: ProfileFilters): Promise<UserList> {
		const currentUserProfile = await this.getUserById(userId);
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

	async getAndUpdateFameRate(userId: string): Promise<number> {
		const fameRate = await this.getFameRate(userId);
		await this.userModel.update([{ id: userId }], { fame_rate: fameRate });
		return fameRate;
	}

	async getFameRate(userId: string): Promise<number> {
		return await this.userModel.getUserFameRate(userId);
	}

	async updateUser(updatedData: User, userId: string): Promise<User> {
		const updatedProfile = await this.userModel.update([{
			id: userId
		}], {
				first_name: updatedData.firstName || undefined,
				last_name: updatedData.lastName || undefined,
				email: updatedData.email || undefined,
				username: updatedData.username || undefined,
				gender: updatedData.gender || undefined,
				birth_date: updatedData.birthDate || undefined,
				sexual_preferences: updatedData.sexualPreferences || undefined,
				biography: updatedData.biography || undefined,
				user_given_location_latitude: updatedData.userGivenLocation?.latitude || null,
				user_given_location_longitude: updatedData.userGivenLocation?.longitude || null,
				is_profile_filled: true
		});

		return this.formatUser(updatedProfile[0]);
	}

	async setProfileLocation(location: GeoCoordinate, userId: string) {
		return await this.userModel.update([{
			id: userId
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
		} catch (error: any) { }
	}

	async getMatchs(userId: string): Promise<{data: Conversation[]}> {
		const matchs = await this.userModel.getMatchs(userId);
		console.log(matchs)
		return matchs//await this.userModel.getMatchs(userId);
	}

}