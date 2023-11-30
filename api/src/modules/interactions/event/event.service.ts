import { PoolClient } from "pg";
import { InteractionsService } from "../interactions.service.js";
import { Event } from "@shared-models/interactions.model.js";
import { EventModel } from "../../../model/event.model.js";
import { UserModel } from "../../../model/user.model.js";
import { CustomError } from "../../../utils/error.util.js";
import { ModelBase } from "../../../model/base.js";
import { LikeService } from "../like/like.service.js";

export class EventService extends InteractionsService {

	eventModel: EventModel;

	constructor(dbClient: PoolClient) {
		super("event", dbClient);
		this.eventModel = new EventModel(dbClient);
	}

	formatEvent(event: event): Partial<Event> {
		return {
			id: event.id || "",
			start: event.start_date,
			end: event.end_date,
			title: event.title,
			date: new Date(event.date),
		}
	}

	async getMatchedUserIdFromUsernameOrThrow(searchedUsername: string, currentId: string): Promise<string> {
		const userModel = new UserModel(this.dbClient);
		const likeService = new LikeService(this.dbClient);
		const user = (await userModel.findMany([{ username: searchedUsername }]))[0];
		if (!user) throw new CustomError("Username not found.", 404);
		if (!(await likeService.areUsersMatching(user.id, currentId))) throw new CustomError("You didn't match with this user.", 403)
		return user.id;
	}

	async getAllEvents(userId: string, timeFrame: { start: Date, end: Date }): Promise<Event[]> {
		const events = await this.eventModel.getEventsList(userId, timeFrame)
		return events.map(event => ({
			...this.formatEvent(event),
			profilePicId: event.profile_pic_id || undefined,
			targetUserId: event.user_id === userId ? event.target_user_id : event.user_id,
			username: event.username
		} as Event));
	}

	async deleteEvent(userId: string, eventId: string): Promise<void> {
		await this.interactionsModel.delete([
			{
				id: eventId,
				user_id: userId
			},
			{
				id: eventId,
				target_user_id: userId
			}
		]);
	}
}
