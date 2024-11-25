import express, { NextFunction } from 'express';
import { Response, Request } from 'express';
import { ViewService } from './view.service.js';
import { BlacklistService } from '../blacklist/blacklist.service.js';

export const viewController = express();

viewController.get("/self", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const viewService = new ViewService(req.dbClient);
		const viewsList = await viewService.getList(req.userId);
		const blacklistService = new BlacklistService(req.dbClient);
		const viewsListWithoutBlacklist = await blacklistService.excludeBlacklistFromInteractionList(viewsList, req.userId);

		res.status(200).json({ data: viewsListWithoutBlacklist });
		next();
	} catch (error: any) {
		error.statusCode = error.statusCode || 400;
		error.message = `Error while fetching views list.`;
		next(error);
	}
});

viewController.get("/others", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const viewService = new ViewService(req.dbClient);
		const viewsList = await viewService.getListWhereCurrentUserIsTarget(req.userId);
		const blacklistService = new BlacklistService(req.dbClient);
		const viewsListWithoutBlacklist = await blacklistService.excludeBlacklistFromInteractionList(viewsList, req.userId);

		res.status(200).json({ data: viewsListWithoutBlacklist });
		next();
	} catch (error: any) {
		error.statusCode = error.statusCode || 400;
		error.message = `Error while fetching views list.`;
		next(error);
	}
});
