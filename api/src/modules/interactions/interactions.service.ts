import { PoolClient } from "pg";
import { Interaction } from "@shared-models/interactions.model.js"
import { AuthService } from "../auth/auth.service.js";
import { ModelBase } from "../../model/base.js";
import { PictureService } from "../picture/picture.service.js";

export class InteractionsService {

	dbClient: PoolClient;
	interactionsModel: ModelBase;

	constructor(table: string, dbClient: PoolClient) {
		this.dbClient = dbClient;
		this.interactionsModel = new ModelBase(table, this.dbClient);
	}

	async getList(userId: string): Promise<Interaction[]> {
		const authService = new AuthService(this.dbClient);
		const pictureService = new PictureService(this.dbClient);
		const list = await this.interactionsModel.findMany([{ user_id: userId }], ["target_profile_id", "date"]);
		const targetedProfileIds = list.map(element => element.target_profile_id);
		const targetedUsers = await authService.getUsersFromProfileIds(targetedProfileIds);
		const targetProfilePictures = await pictureService.getProfilePicIdsOfProfileIds(targetedProfileIds);
		return targetedUsers.map(targetedUser => ({
			profilePicId: targetProfilePictures.find(pic => pic.profileId === targetedUser.profileId)?.id || undefined,
			username: targetedUser.username,
			lastName: targetedUser.lastName,
			firstName: targetedUser.firstName,
			targetProfileId: targetedUser.profileId,
			date: list.find(element => element.target_profile_id === targetedUser.profileId).date
		}));
	}

	async addElement(userId: string, targetProfileId: string): Promise<Interaction> {
		const authService = new AuthService(this.dbClient);
		const pictureService = new PictureService(this.dbClient);
		const associatedUser = (await authService.getUsersFromProfileIds([targetProfileId]))[0];
		await this.interactionsModel.create({
			target_profile_id: targetProfileId,
			user_id: userId
		});
		return {
			profilePicId: (await pictureService.getProfilePictures(targetProfileId)).profilePicture || undefined,
			username: associatedUser.username,
			lastName: associatedUser.lastName,
			firstName: associatedUser.firstName,
			targetProfileId: targetProfileId,
			date: new Date()
		}
	}

	async deleteElement(userId: string, targetProfileId: string) {
		await this.interactionsModel.delete([{
			target_profile_id: targetProfileId,
			user_id: userId
		}]);
	}
}
