import express, { NextFunction } from 'express';
import { Response, Request } from 'express';
import { UserService } from './user.service.js';
import { TagService } from '../tag/tag.service.js';
import { PictureService } from '../picture/picture.service.js';
import { env } from '../../config/config.js';
import { GeoCoordinate, MapGeoCoordinates, ProfileFilters, ProfileFiltersRequest, User } from '@shared-models/user.model.js';
import { ViewService } from '../interactions/view/view.service.js';
import { BlacklistService } from '../interactions/blacklist/blacklist.service.js';
import { CustomError } from '../../utils/error.util.js';

export const userController = express();

userController.get("/userProfile", async (req: Request<any, any, any, { id: string }>, res: Response, next: NextFunction) => {
	try {
		const userService = new UserService(req.dbClient);
		const viewService = new ViewService(req.dbClient);
		
		await userService.getAndUpdateFameRate(req.query?.id || req.userId);
		const profile = await userService.getFullProfile(req.userId, req.query?.id);
		const blacklistService = new BlacklistService(req.dbClient);	

		if (await blacklistService.hasBlacklistBetweenUsers(req.userId, profile.id)) {
			throw new CustomError("You are blacklisted by this user.", 403);
		}

		if (req.query?.id)
			await viewService.addElement(req.userId, req.query.id);
		res.status(200).json({ data: profile as User || null });
		next();
	} catch (error: any) {
		error.statusCode = error.statusCode || 400;
		error.message = `Error while fetching user profile.`;
		next(error);
	}
});

userController.get("/userList", async (req: Request<any, any, any, ProfileFiltersRequest>, res: Response, next: NextFunction) => {
	try {
		const userService = new UserService(req.dbClient);
		const filters: ProfileFilters = userService.formatUserFilters(req.query);
		const userList = await userService.getUserList(filters, req.userId);
		const blacklistService = new BlacklistService(req.dbClient);
		const userListWithoutBlacklisers = await blacklistService.excludeCombinedBlacklistFromUserList(userList, req.userId);

		res.status(200).json({ data: userListWithoutBlacklisers });
		next();
	} catch (error: any) {
		error.statusCode = error.statusCode || 400;
		error.message = `Error while fetching user list.`;
		next(error);
	}
});

userController.get("/mapUsers", async (req: Request<any, any, any, ProfileFiltersRequest>, res: Response, next: NextFunction) => {
	try {
		const userService = new UserService(req.dbClient);
		const mapGeoCoordinates: MapGeoCoordinates = req.query as unknown as MapGeoCoordinates;
		const userList = await userService.getMapList(mapGeoCoordinates, req.userId);
		const blacklistService = new BlacklistService(req.dbClient);
		const blacklisters = await blacklistService.getListWhereCurrentUserIsTarget(req.userId);
		const userListWithoutBlacklisers = userList.filter(
			user => !blacklisters.some(blacklister => blacklister.targetUserId === user.id)
		);

		res.status(200).json({ data: userListWithoutBlacklisers });
		next();
	} catch (error: any) {
		error.statusCode = error.statusCode || 400;
		error.message = `Error while fetching user list.`;
		next(error);
	}
});

userController.get("/matchingProfiles", async (req: Request<any, any, any, ProfileFiltersRequest>, res: Response, next: NextFunction) => {
	try {
		const batchSize = '5';
		const userService = new UserService(req.dbClient);
		const filters: ProfileFilters = userService.formatUserFilters({...req.query, batchSize: batchSize});
		const matchingProfiles = await userService.getMatchingProfiles(req.userId, filters);
		const blacklistService = new BlacklistService(req.dbClient);
		const matchingProfilesWithoutBlacklisers = await blacklistService.excludeCombinedBlacklistFromUserList(matchingProfiles, req.userId);

		res.status(200).json({ data: matchingProfilesWithoutBlacklisers });
		next();
	} catch (error: any) {
		error.statusCode = error.statusCode || 400;
		error.message = `Error while fetching matching profiles.`;
		next(error);
	}
});

userController.get("/matchs", async (req: Request<any, any, any, ProfileFiltersRequest>, res: Response, next: NextFunction) => {
	try {
		const userService = new UserService(req.dbClient);
		const matchingProfiles = await userService.getMatchs(req.userId);
		if (!matchingProfiles.data) {
			return res.status(200).json({ data: [] });
		}
		const blacklistService = new BlacklistService(req.dbClient);
		const matchsWithoutBlacklisters = await blacklistService
			.excludeBlacklistFromMatchList(matchingProfiles.data, req.userId);

		res.status(200).json({ data: matchsWithoutBlacklisters });
		next();
	} catch (error: any) {
		error.statusCode = error.statusCode || 400;
		error.message = `Error while fetching matched profiles.`;
		next(error);
	}
});

userController.put("/", async (req: Request, res: Response, next: NextFunction) => {
	try {
		let updatedProfileData: User = req.body;
		const tagService = new TagService(req.dbClient);
		const userService = new UserService(req.dbClient);
		const pictureService = new PictureService(req.dbClient);
		
		const updatedProfile: User = await userService.updateUser(updatedProfileData, req.userId);
		if (updatedProfileData.tags)
			await tagService.updateUserTags(updatedProfile.id, updatedProfileData.tags);
		if (updatedProfileData.picturesIds)
			await pictureService.updateProfilePictures(updatedProfileData.picturesIds, updatedProfile.id);
		res.status(200).json({ data: { ...updatedProfileData, id: updatedProfile.id }, message: "Profile successfully updated." });
		next();
	} catch (error: any) {
		error.statusCode = 403;
		error.message = `Error: username or email already taken.`;
		next(error);
	}
});

userController.post("/setTrackingLocation", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userService = new UserService(req.dbClient);
		let location: GeoCoordinate = req.body;
		
		if (!location.latitude || !location.longitude)
			location = await userService.getLocationFromIpAddress(env.url.includes("localhost") ? await userService.getLocalhostIpAddress() : req.ip);
		await userService.setProfileLocation(location, req.userId);

		res.status(200).json({ date: location });
		next();
	} catch (error: any) {
		error.statusCode = error.statusCode || 400;
		error.message = '';
		next(error);
	}
});