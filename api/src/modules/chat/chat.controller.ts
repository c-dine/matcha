import express, { NextFunction } from 'express';
import { Response, Request } from 'express';
import { ChatService } from './chat.service.js';
import { Message } from '@shared-models/chat.models.js';
import { CustomError } from '../../utils/error.util.js';
import { BlacklistService } from '../interactions/blacklist/blacklist.service.js';
import { LikeService } from '../interactions/like/like.service.js';

export const chatController = express();

chatController.get("/messages/:id", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const chatService = new ChatService(req.dbClient);
		const blacklistService = new BlacklistService(req.dbClient);
		if (await blacklistService.hasBlacklistBetweenUsers(req.userId, req.params.id)) {
			throw new CustomError("Forbidden.", 403);
		}
		const messages =
			(await chatService.getMessages(req.userId, req.params.id))?.sort(
				(a, b) => b.date.getTime() - a.date.getTime());

		res.status(200).json({ data: messages as Message[] || null });
		next();
	} catch (error: any) {
		error.message = `Error while fetching messages.`;
		next(error);
	}
});

chatController.get("/conversations", async (req: Request<any, any, any, { id: string }>, res: Response, next: NextFunction) => {
	try {
		const chatService = new ChatService(req.dbClient);
		const conversations = (await chatService.getConversations(req.userId))?.data?.sort(
			(a, b) => new Date(b.notification?.date).getTime() - new Date(a.notification?.date).getTime()
		);
		if (!conversations) {
			res.status(200).json({data: []});
			next();
			return;
		}
		const blacklistService = new BlacklistService(req.dbClient);
		const conversationsWithoutBlacklist = await blacklistService.excludeBlacklistFromConversationList(conversations, req.userId);
		res.status(200).json({data: conversationsWithoutBlacklist});
		next();
	} catch (error: any) {
		error.message = `Error while fetching conversations.`;
		next(error);
	}
});

chatController.post("/message/:id", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const chatService = new ChatService(req.dbClient);
		const body = req.body;
		const likeService = new LikeService(req.dbClient);
		if (!await likeService.areUsersMatching(req.userId, req.params.id)) {
			throw new CustomError("Forbidden.", 403);
		}
		const blacklistService = new BlacklistService(req.dbClient);
		if (await blacklistService.hasBlacklistBetweenUsers(req.userId, req.params.id)) {
			throw new CustomError("Forbidden.", 403);
		}
		const message = await chatService.postMessage(req.userId, req.params.id, body.message);
		res.status(200).json({ data: message as Message || null });
		next();
	} catch (error: any) {
		error.message = `Error while creating message.`;
		next(error);
	}
});

chatController.put("/view", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const chatService = new ChatService(req.dbClient);
		const body = req.body;
		if (!body.id) {
			throw new CustomError("Bad Request.", 400);
		}
		const blacklistService = new BlacklistService(req.dbClient);
		if (await blacklistService.hasBlacklistBetweenUsers(req.userId, body.id)) {
			throw new CustomError("Forbidden.", 403);
		}
		let messageToUpdate = await chatService.getMessage(body.id);
		if (messageToUpdate.to_user_id !== req.userId
			&& messageToUpdate.from_user_id !== req.userId) {
			throw new CustomError("Forbidden.", 403);
		}
		messageToUpdate = await chatService.view(body.id);
		if (!messageToUpdate) {
			throw new CustomError("Not Found.", 404);
		}
		res.status(200).json({ data: { message: 'success.' } });
		next();
	} catch (error: any) {
		error.message = `Error while updating message.`;
		next(error);
	}
});
