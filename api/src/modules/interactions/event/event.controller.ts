import express, { NextFunction } from 'express';
import { Response, Request } from 'express';
import { EventService } from './event.service.js';
import { Event } from '@shared-models/interactions.model.js';
import { BlacklistService } from '../blacklist/blacklist.service.js';
import { CustomError } from '../../../utils/error.util.js';

export const eventController = express();

eventController.get("/", async (req: Request<any, any, any, { start: string, end: string }>, res: Response, next: NextFunction) => {
	try {
		const eventService = new EventService(req.dbClient);
		const timeFrame: { start: Date, end: Date } = { start: new Date(req.query.start), end: new Date(req.query.end) }
		const eventList = await eventService.getAllEvents(req.userId, timeFrame);
		const blacklistService = new BlacklistService(req.dbClient);
		const eventListWithoutBlacklist = await blacklistService.excludeBlacklistFromEventList(eventList, req.userId);

		res.status(200).json({ data: eventListWithoutBlacklist });
		next();
	} catch (error: any) {
		error.statusCode = error.statusCode || 400;
		error.message = `Error while fetching event.`;
		next(error);
	}
});

eventController.post("/", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const newEvent = req.body.event as Event;
		if (new Date(newEvent.start) > new Date(newEvent.end)) {
			const tmpStart = newEvent.start;
			newEvent.start = newEvent.end;
			newEvent.end = tmpStart;
		}
		const eventService = new EventService(req.dbClient);
		const targetUserId = await eventService.getMatchedUserIdFromUsernameOrThrow(newEvent.username, req.userId);
		const blacklistService = new BlacklistService(req.dbClient);
		if (await blacklistService.hasBlacklistBetweenUsers(req.userId, targetUserId)) {
			throw new CustomError("You are blacklisted by this user.", 403);
		}
		const addedEvent = await eventService.addElement(
			req.userId,
			targetUserId,
			{
				title: newEvent.title,
				location: newEvent.eventLocation,
				start_date: newEvent.start,
				end_date: newEvent.end
			}
		);

		res.status(201).json({ 
			data: addedEvent,
			message: "Event successfully created."
		});
		next();
	} catch (error: any) {
		error.statusCode = error.statusCode || 400;
		error.message = error.message || `Error while creating an event.`;
		next(error);
	}
});

eventController.delete("/:eventId", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const eventId = req.params.eventId;
		const eventService = new EventService(req.dbClient);
		await eventService.deleteEvent(req.userId, eventId);

		res.status(200).json({ 
			message: "Event successfully deleted." 
		});
		next();
	} catch (error: any) {
		error.statusCode = error.statusCode || 400;
		error.message = `Error while deleting an event.`;
		next(error);
	}
});


