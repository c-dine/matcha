import express, { NextFunction } from 'express';
import { Response, Request } from 'express';
import { ProfileService } from './profile.service.js';

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
