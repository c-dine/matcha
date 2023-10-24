import express, { NextFunction } from 'express';
import { Response, Request } from 'express';
import { LikeService } from './like.service.js';

export const likeController = express();

likeController.post("/", async (req: Request, res: Response, next: NextFunction) => {
	const targetProfileId = req.body.targetProfileId;
	const isLiked = !!req.body.isLiked;
	try {
		const likeService = new LikeService(req.dbClient);
		await likeService.deleteElement(req.userId, targetProfileId);
		const addedLike = await likeService.addElement(
			req.userId,
			targetProfileId,
			{ is_liked: isLiked }
		);

		res.status(201).json({ 
			data: addedLike,
			message: `Profile successfully ${isLiked ? "liked" : "disliked"}.`
		});
		next();
	} catch (error: any) {
		console.error(`Error while ${isLiked ? "liking" : "disliking"} profile: ${error}.`);
		error.message = `Error while ${isLiked ? "liking" : "disliking"} profile.`;
		next(error);
	}
});

likeController.delete("/:targetProfileId", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const targetProfileId = req.params.targetProfileId;
		const likeService = new LikeService(req.dbClient);
		await likeService.deleteElement(req.userId, targetProfileId);

		res.status(200).json({ 
			message: "Profile successfully unliked." 
		});
		next();
	} catch (error: any) {
		console.error(`Error while unliking profile: ${error}.`);
		error.message = `Error while unliking profile.`;
		next(error);
	}
});


