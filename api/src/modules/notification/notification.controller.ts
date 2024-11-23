import express, { NextFunction } from 'express';
import { Response, Request } from 'express';
import { NotificationService } from './notification.service.js';
import { CustomError } from '../../utils/error.util.js'
import { NotificationWithAuthor } from "@shared-models/notification.model.js";import { BlacklistService } from '../interactions/blacklist/blacklist.service.js';
;

export const notificationController = express();

const isActivityType = (input: string) => {
	return ["like", "unlike", "dislike", "view", "match", "date", "date deleted"].includes(input);
}

notificationController.get("/notifications", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const notificationService = new NotificationService(req.dbClient);
		const notifications =
			(await notificationService.getNotificationsWithAuthor(req.userId))?.data
			?.sort(
				(a, b) => new Date(b.notification.date).getTime() - new Date(a.notification.date).getTime()
			)
		if (!notifications) {
			res.status(200).json({data: []});
			next();
			return;
		}
		const blacklistService = new BlacklistService(req.dbClient);
		const notificationsWithoutBlacklist = await blacklistService.excludeCombinedBlacklistFromNotifications(notifications, req.userId);
		notificationsWithoutBlacklist?.forEach(el => el.notification.date = new Date(el.notification.date));
		res.status(200).json({data: notificationsWithoutBlacklist});
		next();
	} catch (error: any) {
		error.message = `Error while fetching notifications.`;
		next(error);
	}
});

notificationController.post("/", async (req: Request, res: Response, next: NextFunction) => {
	// faire controle des notifications en fonction de si le type de notification est correct (ex si view verifier que l'utilisateur a bien vu)
	try {
		const notificationService = new NotificationService(req.dbClient);
		const body = req.body;
		const blacklistService = new BlacklistService(req.dbClient);

		if (await blacklistService.hasBlacklistBetweenUsers(req.userId, body.toUserId)) {
			throw new CustomError("You are blacklisted by this user.", 403);
		}
		if (body.fromUserId !== req.userId) {
			throw new CustomError("Forbidden.", 403);
		}
		if (!body.fromUserId || !body.toUserId || !isActivityType(body.type)) {
			throw new CustomError("Bad Request.", 400);
		}
		const message = await notificationService.postNotification(body.fromUserId, body.toUserId, body.type);

		res.status(200).json({ data: message as NotificationWithAuthor || null });
		next();
	} catch (error: any) {
		error.message = `Error while creating notification.`;
		next(error);
	}
});

notificationController.put("/view", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const notificationService = new NotificationService(req.dbClient);
		const body = req.body;
		const blacklistService = new BlacklistService(req.dbClient);

		if (await blacklistService.hasBlacklistBetweenUsers(req.userId, body.toUserId)) {
			throw new CustomError("You are blacklisted by this user.", 403);
		}
		if (!body.id) {
			throw new CustomError("Bad Request.", 400);
		}
		let notificationToUpdate = await notificationService.getNotification(body.id);
		if (notificationToUpdate.to_user_id !== req.userId) {
			throw new CustomError("Forbidden.", 403);
		}
		notificationToUpdate = await notificationService.view(body.id);
		if (!notificationToUpdate) {
			throw new CustomError("Not Found.", 404);
		}
		res.status(200).json({ data: {message: 'success.'} });
		next();
	} catch (error: any) {
		error.message = `Error while updating notification.`;
		next(error);
	}
});