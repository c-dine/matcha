import express, { NextFunction } from 'express';
import { Response, Request } from 'express';
import { PictureService } from './picture.service.js';

export const pictureController = express();

pictureController.get("/generateUploadUrl", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const count = Number(req.query.count);
		const pictureService = new PictureService(req.dbClient);
		const url = await pictureService.generateMultipleUploadUrls(count);
		
		res.status(200).json(url);
		next();
	} catch (error: any) {
		console.error(`Error while generating picture links: ${error}`);
		error.message = "Error while generating picture links."; 
		next(error);
	}
});
