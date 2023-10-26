import express, { NextFunction } from 'express';
import { Response, Request } from 'express';
import { ChatService } from './chat.service.js';
import { Message } from '@shared-models/chat.models.js';

export const chatController = express();

chatController.get("/messages", async (req: Request<any, any, any, { id: string }>, res: Response, next: NextFunction) => {
	try {
		const chatService = new ChatService(req.dbClient);
		const messages = await chatService.getMessages(req.userId, req.query.id);

		res.status(200).json({ data: messages as Message[] || null });
		next();
	} catch (error: any) {
		console.error(`Error while fetching messages: ${error}.`);
		error.message = `Error while fetching messages.`;
		next(error);
	}
});

chatController.get("/conversations", async (req: Request<any, any, any, { id: string }>, res: Response, next: NextFunction) => {
	try {
		const chatService = new ChatService(req.dbClient);
		const messages = await chatService.getMessages(req.userId, req.query.id);

		res.status(200).json({ data: messages as Message[] || null });
		next();
	} catch (error: any) {
		console.error(`Error while fetching conversations: ${error}.`);
		error.message = `Error while fetching conversations.`;
		next(error);
	}
});

chatController.post("/message", async (req: Request<any, any, any, { id: string }>, res: Response, next: NextFunction) => {
	try {
		const chatService = new ChatService(req.dbClient);
		const message = await chatService.postMessage(req.userId, req.query.id, "message");

		res.status(200).json({ data: message as Message || null });
		next();
	} catch (error: any) {
		console.error(`Error while creating message: ${error}.`);
		error.message = `Error while creating message.`;
		next(error);
	}
});