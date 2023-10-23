import express, { NextFunction } from 'express';
import { Response, Request } from 'express';
import { ProfileService } from './profile.service.js';
import { TagService } from '../tag/tag.service.js';
import { PictureService } from '../picture/picture.service.js';
import { env } from '../../config/config.js';
import { GeoCoordinate, Profile, ProfileFilters, ProfileFiltersRequest, UserProfile } from '@shared-models/profile.model.js';
import { ViewService } from '../interactions/view/view.service.js';

export const profileController = express();

profileController.get("/", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const profileService = new ProfileService(req.dbClient);
		const profile = await profileService.getUserProfile(req.userId);

		res.status(200).json({ data: profile as Profile || null });
		next();
	} catch (error: any) {
		console.error(`Error while fetching user profile: ${error}.`);
		error.message = `Error while fetching user profile.`;
		next(error);
	}
});

profileController.get("/userProfile", async (req: Request<any, any, any, { id: string }>, res: Response, next: NextFunction) => {
	try {
		const profileService = new ProfileService(req.dbClient);
		const viewService = new ViewService(req.dbClient);
		const profile = await profileService.getUserProfile(req.userId, req.query.id);

		await viewService.addElement(req.userId, req.query.id);
		res.status(200).json({ data: profile as UserProfile || null });
		next();
	} catch (error: any) {
		console.error(`Error while fetching user profile: ${error}.`);
		error.message = `Error while fetching user profile.`;
		next(error);
	}
});

profileController.get("/userList", async (req: Request<any, any, any, ProfileFiltersRequest>, res: Response, next: NextFunction) => {
	try {
		const profileService = new ProfileService(req.dbClient);
		const filters: ProfileFilters = profileService.formatProfileFilters(req.query);
		const userList = await profileService.getUserList(filters, req.userId);

		res.status(200).json({ data: userList });
		next();
	} catch (error: any) {
		console.error(`Error while fetching user list: ${error}.`);
		error.message = `Error while fetching user list.`;
		next(error);
	}
});

profileController.get("/matchingProfiles", async (req: Request<any, any, any, ProfileFiltersRequest>, res: Response, next: NextFunction) => {
	try {
		const batchSize = '5';
		const profileService = new ProfileService(req.dbClient);
		const filters: ProfileFilters = profileService.formatProfileFilters({...req.query, batchSize: batchSize});
		const matchingProfiles = await profileService.getMatchingProfiles(req.userId, filters);

		res.status(200).json({ data: matchingProfiles });
		next();
	} catch (error: any) {
		console.error(`Error while fetching matching profiles: ${error}.`);
		error.message = `Error while fetching matching profiles.`;
		next(error);
	}
});

profileController.put("/", async (req: Request, res: Response, next: NextFunction) => {
	try {
		let updatedProfileData: Profile = req.body;
		const tagService = new TagService(req.dbClient);
		const profileService = new ProfileService(req.dbClient);
		const pictureService = new PictureService(req.dbClient);
		
		const updatedProfile: Profile = await profileService.updateProfile(updatedProfileData, req.userId);
		await tagService.updateProfileTags(updatedProfile.id, updatedProfileData.tags);
		await pictureService.updateProfilePictures(updatedProfileData.picturesIds, updatedProfile.id);
		res.status(200).json({ data: { ...updatedProfileData, id: updatedProfile.id }, message: "Profile successfully updated." });
		next();
	} catch (error: any) {
		console.error(error);
		error.message = `Error while updating user profile.`;
		next(error);
	}
});

profileController.post("/", async (req: Request, res: Response, next: NextFunction) => {
	try {
		let newProfile: Profile = req.body;
		const tagService = new TagService(req.dbClient);
		const profileService = new ProfileService(req.dbClient);
		const pictureService = new PictureService(req.dbClient);
		
		if (!newProfile.location)
			newProfile.location = await profileService.getLocationFromIpAddress(env.url.includes("localhost") ? await profileService.getLocalhostIpAddress() : req.ip);
		
		const createdProfile: Profile = await profileService.createProfile(newProfile, req.userId);
		await pictureService.createProfilePictures(newProfile.picturesIds, createdProfile.id);
		await tagService.linkTagsToProfile(createdProfile.id, newProfile.tags);
		res.status(201).json({ data: { newProfile, id: createdProfile.id } });
		next();
	} catch (error: any) {
		console.error(`Error while creating user profile: ${error}.`);
		error.message = `Error while creating user profile.`;
		next(error);
	}
});

profileController.post("/setLocation", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const profileService = new ProfileService(req.dbClient);
		let location: GeoCoordinate = req.body;
		
		if (!location)
			location = await profileService.getLocationFromIpAddress(env.url.includes("localhost") ? await profileService.getLocalhostIpAddress() : req.ip);
		await profileService.setProfileLocation(location, req.userId);

		res.status(200).json({ date: location });
		next();
	} catch (error: any) {
		console.error(`Error while creating user profile: ${error}.`);
		error.message = `Error while creating user profile.`;
		next(error);
	}
});