import express, { NextFunction } from 'express';
import { Response, Request } from 'express';
import { TagService } from './tag.service.js';

export const tagController = express();

tagController.get("/", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const tagService = new TagService(req.dbClient);
		const tags = await tagService.getTags();

		res.status(200).json({ data: tags });
		next();
	} catch (error: any) {
		error.message = `Error while fetching tags.`;
		next(error);
	}
});
