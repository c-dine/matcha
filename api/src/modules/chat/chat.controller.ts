import express, { NextFunction } from 'express';
import { Response, Request } from 'express';
import { ChatService } from './chat.service.js';
import { Conversation, Message } from '@shared-models/chat.models.js';

export const chatController = express();

chatController.get("/messages/:id", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const chatService = new ChatService(req.dbClient);
		const messages =
			(await chatService.getMessages(req.userId, req.params.id))
			.sort((a, b) => b.date.getTime() - a.date.getTime());

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
		const messages = await chatService.getConversations(req.userId);

		res.status(200).json({ data: messages as Conversation[] || null });
		next();
	} catch (error: any) {
		error.message = `Error while fetching conversations.`;
		next(error);
	}
});

chatController.post("/message/:id", async (req: Request, res: Response, next: NextFunction) => {
	try {
		// verifier que les utilisateurs ont bien matche pour qu'ils puissent s'envoyer des messages
		const chatService = new ChatService(req.dbClient);
		const body = req.body;
		const message = await chatService.postMessage(req.userId, req.params.id, body.message);

		res.status(200).json({ data: message as Message || null });
		next();
	} catch (error: any) {
		error.message = `Error while creating message.`;
		next(error);
	}
});