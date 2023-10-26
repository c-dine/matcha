import express, { NextFunction } from 'express';
import { Response, Request } from 'express';
import { ViewService } from './view.service.js';

export const viewController = express();

viewController.get("/self", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const viewService = new ViewService(req.dbClient);
		const viewsList = await viewService.getList(req.userId);

		res.status(200).json({ data: viewsList });
		next();
	} catch (error: any) {
		console.error(`Error while fetching views list: ${error}.`);
		error.message = `Error while fetching views list.`;
		next(error);
	}
});

viewController.get("/others", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const viewService = new ViewService(req.dbClient);
		const viewsList = await viewService.getListWhereCurrentUserIsTarget(req.userId);

		res.status(200).json({ data: viewsList });
		next();
	} catch (error: any) {
		console.error(`Error while fetching views list: ${error}.`);
		error.message = `Error while fetching views list.`;
		next(error);
	}
});
