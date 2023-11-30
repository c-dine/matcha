import { PoolClient } from "pg";
import { InteractionsService } from "../interactions.service.js";
import { Event } from "@shared-models/interactions.model.js";
import { EventModel } from "../../../model/event.model.js";
import { UserModel } from "../../../model/user.model.js";
import { CustomError } from "../../../utils/error.util.js";
import { ModelBase } from "../../../model/base.js";
import { LikeService } from "../like/like.service.js";
import { UserService } from "../../user/user.service.js";
import { PictureService } from "../../picture/picture.service.js";

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
			eventLocation: event.location
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

	async addElement(
		userId: string,
		targetUserId: string,
		additionnalData?: { [column: string]: any }
	): Promise<Event> {
		const userService = new UserService(this.dbClient);
		const pictureService = new PictureService(this.dbClient);
		const associatedUser = (await userService.getUsers([ { id: targetUserId } ]))[0];
		const addedEvent = await this.interactionsModel.create({
			target_user_id: targetUserId,
			user_id: userId,
			...additionnalData
		});
		return {
			...this.formatEvent(addedEvent),
			profilePicId: (await pictureService.getProfilePictures(targetUserId)).profilePicture || undefined,
			username: associatedUser.username,
			lastName: associatedUser.lastName,
			firstName: associatedUser.firstName,
			targetUserId: targetUserId,
			date: new Date()
		}
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
