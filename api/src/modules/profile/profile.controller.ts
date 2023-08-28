import express, { NextFunction } from 'express';
import { Response, Request } from 'express';
import { ProfileService } from './profile.service.js';
import { NewProfile } from '@shared-models/profile.model.js';
import { TagService } from '../tag/tag.service.js';
import { Profile } from '@shared-models/common.models.js';
import { PictureService } from '../picture/picture.service.js';
import { env } from '../../config/config.js';

export const profileController = express();

profileController.get("/", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const profileService = new ProfileService(req.dbClient);
		const profile = await profileService.getProfile(req.userId);

		res.status(200).json({ data: profile || null });
		next();
	} catch (error: any) {
		console.error(`Error while fetching user profile: ${error}.`);
		error.message = `Error while fetching user profile.`;
		next(error);
	}
});


profileController.post("/", async (req: Request, res: Response, next: NextFunction) => {
	try {
		let newProfile: NewProfile = req.body;
		const tagService = new TagService(req.dbClient);
		const profileService = new ProfileService(req.dbClient);
		const pictureService = new PictureService(req.dbClient);
		
		if (!newProfile.location)
			newProfile.location = await profileService.getLocationFromIpAddress(env.url.includes("localhost") ? await profileService.getLocalhostIpAddress() : req.ip);
		
		const createdProfile: Profile = await profileService.createProfile(newProfile, req.userId);
		await pictureService.createProfilePictures(newProfile.picturesIds, createdProfile.id);
		await tagService.linkTagsToProfile(createdProfile.id, newProfile.tags);
		res.status(201).json({ data: createdProfile });
		next();
	} catch (error: any) {
		console.error(`Error while creating user profile: ${error}.`);
		error.message = `Error while creating user profile.`;
		next(error);
	}
});