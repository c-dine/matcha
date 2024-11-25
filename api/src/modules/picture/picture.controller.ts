import express, { NextFunction } from 'express';
import { Response, Request } from 'express';
import { PictureService } from './picture.service.js';
import axios from 'axios';
import { GoogleMediaItem } from '@shared-models/picture.model.js';

export const pictureController = express();

pictureController.get("/generateUploadUrl", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const count = Number(req.query.count);
		const pictureService = new PictureService(req.dbClient);
		const url = await pictureService.generateMultipleUploadUrls(count);
		
		res.status(200).json(url);
		next();
	} catch (error: any) {
		error.statusCode = error.statusCode || 400;
		error.message = "Error while generating picture links."; 
		next(error);
	}
});

pictureController.get("/googlePhotos", async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (!req.isAuthenticated())
			throw new Error;
		const headers = { Authorization: `Bearer ${(req.user as any).accessToken}` };
		const mediaItems = await axios.get(`https://photoslibrary.googleapis.com/v1/mediaItems`, { headers })
			.then(data => data.data);
		res.status(200).json((mediaItems as any).mediaItems);
		next();
	} catch (error: any) {
		error.statusCode = error.statusCode || 400;
		error.message = "Error while connecting to google photos."; 
		next(error);
	}
});

pictureController.get("/googlePhoto/:id", async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (!req.params.id)
			throw new Error;
		const apiUrl = `https://photoslibrary.googleapis.com/v1/mediaItems/${req.params.id}`;
		const headers = { Authorization: `Bearer ${(req.user as any).accessToken}` };
		const mediaItem: GoogleMediaItem = await axios.get(apiUrl, { headers })
			.then(data => data.data);
		const photo = await axios.get(mediaItem.baseUrl, { responseType: 'arraybuffer' })
			.then(data => data.data);
		res.status(200).json(photo);
		next();
	} catch (error: any) {
		error.statusCode = error.statusCode || 400;
		error.message = "Error while fetching google photo."; 
		next(error);
	}
});
