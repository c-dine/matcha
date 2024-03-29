import express, { NextFunction } from 'express';
import { Response, Request } from 'express';
import { UserService } from './user.service.js';
import { TagService } from '../tag/tag.service.js';
import { PictureService } from '../picture/picture.service.js';
import { env } from '../../config/config.js';
import { GeoCoordinate, MapGeoCoordinates, ProfileFilters, ProfileFiltersRequest, User } from '@shared-models/user.model.js';
import { ViewService } from '../interactions/view/view.service.js';

export const userController = express();

userController.get("/userProfile", async (req: Request<any, any, any, { id: string }>, res: Response, next: NextFunction) => {
	try {
		const userService = new UserService(req.dbClient);
		const viewService = new ViewService(req.dbClient);
		await userService.getAndUpdateFameRate(req.query?.id || req.userId);
		const profile = await userService.getFullProfile(req.userId, req.query?.id);

		if (req.query?.id)
			await viewService.addElement(req.userId, req.query.id);
		res.status(200).json({ data: profile as User || null });
		next();
	} catch (error: any) {
		error.message = `Error while fetching user profile.`;
		next(error);
	}
});

userController.get("/userList", async (req: Request<any, any, any, ProfileFiltersRequest>, res: Response, next: NextFunction) => {
	try {
		const userService = new UserService(req.dbClient);
		const filters: ProfileFilters = userService.formatUserFilters(req.query);
		const userList = await userService.getUserList(filters, req.userId);

		res.status(200).json({ data: userList });
		next();
	} catch (error: any) {
		error.message = `Error while fetching user list.`;
		next(error);
	}
});

userController.get("/mapUsers", async (req: Request<any, any, any, ProfileFiltersRequest>, res: Response, next: NextFunction) => {
	try {
		const userService = new UserService(req.dbClient);
		const mapGeoCoordinates: MapGeoCoordinates = req.query as unknown as MapGeoCoordinates;
		const userList = await userService.getMapList(mapGeoCoordinates, req.userId);

		res.status(200).json({ data: userList });
		next();
	} catch (error: any) {
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

		res.status(200).json({ data: matchingProfiles });
		next();
	} catch (error: any) {
		error.message = `Error while fetching matching profiles.`;
		next(error);
	}
});

userController.get("/matchs", async (req: Request<any, any, any, ProfileFiltersRequest>, res: Response, next: NextFunction) => {
	try {
		const userService = new UserService(req.dbClient);
		const matchingProfiles = await userService.getMatchs(req.userId);
		res.status(200).json({data: matchingProfiles.data ? matchingProfiles.data : []});
		next();
	} catch (error: any) {
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
		error.message = `Error while updating user profile.`;
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
		error.message = '';
		next(error);
	}
});