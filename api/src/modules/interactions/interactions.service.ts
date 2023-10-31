import { PoolClient } from "pg";
import { Interaction } from "@shared-models/interactions.model.js"
import { ModelBase } from "../../model/base.js";
import { PictureService } from "../picture/picture.service.js";
import { UserService } from "../user/user.service.js";

export class InteractionsService {

	dbClient: PoolClient;
	interactionsModel: ModelBase;

	constructor(table: string, dbClient: PoolClient) {
		this.dbClient = dbClient;
		this.interactionsModel = new ModelBase(table, this.dbClient);
	}

	async getList(
		userId: string,
		additionnalInteractionData?: { [column: string]: any }
	): Promise<Interaction[]> {
		const userService = new UserService(this.dbClient);
		const pictureService = new PictureService(this.dbClient);

		const interactionList = await this.interactionsModel.findMany([{
			user_id: userId,
			...additionnalInteractionData
		}], ["target_user_id", "date"]);
		const targetedUserIds = interactionList.map(element => element.target_user_id);
		const targetedUsers = await userService.getUsers(targetedUserIds.map(id => ({ id })));
		const targetProfilePictures = await pictureService.getProfilePicIdsOfUserIds(targetedUserIds);
		return interactionList.map(datedProfileIdsList => {
			const targetedUser = targetedUsers.find(user => user.id === datedProfileIdsList.target_user_id);
			return {
				profilePicId: targetProfilePictures.find(pic => pic.userId === targetedUser.id)?.id || undefined,
				username: targetedUser.username,
				lastName: targetedUser.lastName,
				firstName: targetedUser.firstName,
				targetUserId: targetedUser.id,
				date: datedProfileIdsList.date
			}
		});
	}

	async getListWhereCurrentUserIsTarget(
		userId: string,
		additionnalInteractionData?: { [column: string]: any }
	): Promise<Interaction[]> {
		const userService = new UserService(this.dbClient);
		const pictureService = new PictureService(this.dbClient);

		const interactionList = await this.interactionsModel.findMany([{
			target_user_id: userId,
			...additionnalInteractionData
		}], ["user_id", "date"]);
		const originUserIds = interactionList.map(element => element.user_id);
		const originUsers = await userService.getUsers(originUserIds.map(id => ({ id })));
		const targetProfilePictures = await pictureService.getProfilePicIdsOfUserIds(originUserIds);
		return interactionList.map(datedProfileIdsList => {
			const originUser = originUsers.find(user => user.id === datedProfileIdsList.user_id);
			return {
				profilePicId: targetProfilePictures.find(pic => pic.userId === originUser.id)?.id || undefined,
				username: originUser.username,
				lastName: originUser.lastName,
				firstName: originUser.firstName,
				targetUserId: originUser.id,
				date: datedProfileIdsList.date
			}
		});
	}

	async addElement(
		userId: string,
		targetUserId: string,
		additionnalData?: { [column: string]: any }
	): Promise<Interaction> {
		const userService = new UserService(this.dbClient);
		const pictureService = new PictureService(this.dbClient);
		const associatedUser = (await userService.getUsers([ { id: targetUserId } ]))[0];
		await this.interactionsModel.create({
			target_user_id: targetUserId,
			user_id: userId,
			...additionnalData
		});
		return {
			profilePicId: (await pictureService.getProfilePictures(targetUserId)).profilePicture || undefined,
			username: associatedUser.username,
			lastName: associatedUser.lastName,
			firstName: associatedUser.firstName,
			targetUserId: targetUserId,
			date: new Date()
		}
	}

	async deleteElement(userId: string, targetUserId: string) {
		await this.interactionsModel.delete([{
			target_user_id: targetUserId,
			user_id: userId
		}]);
	}
}
