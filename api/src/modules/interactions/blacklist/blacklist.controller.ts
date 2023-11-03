import express, { NextFunction } from 'express';
import { Response, Request } from 'express';
import { BlacklistService } from './blacklist.service.js';

export const blacklistController = express();

blacklistController.get("/", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const blacklistService = new BlacklistService(req.dbClient);
		const blacklist = await blacklistService.getList(req.userId);

		res.status(200).json({ data: blacklist });
		next();
	} catch (error: any) {
		console.error(`Error while fetching blacklist: ${error}.`);
		error.message = `Error while fetching blacklist.`;
		next(error);
	}
});

blacklistController.post("/", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const targetUserId = req.body.targetUserId;
		const blacklistService = new BlacklistService(req.dbClient);
		const blacklistedUser = await blacklistService.addElement(req.userId, targetUserId);

		res.status(201).json({ 
			data: blacklistedUser,
			message: "Profile successfully blacklisted."
		});
		next();
	} catch (error: any) {
		console.error(`Error while blacklisting: ${error}.`);
		error.message = `Error while blacklisting.`;
		next(error);
	}
});

blacklistController.delete("/:targetUserId", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const targetUserId = req.params.targetUserId;
		const blacklistService = new BlacklistService(req.dbClient);
		await blacklistService.deleteElement(req.userId, targetUserId);

		res.status(200).json({ 
			message: "Profile successfully unblacklisted." 
		});
		next();
	} catch (error: any) {
		console.error(`Error while unblacklisting: ${error}.`);
		error.message = `Error while unblacklisting.`;
		next(error);
	}
});


