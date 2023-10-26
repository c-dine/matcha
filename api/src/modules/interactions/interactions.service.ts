import { PoolClient } from "pg";
import { Interaction } from "@shared-models/interactions.model.js"
import { AuthService } from "../auth/auth.service.js";
import { ModelBase } from "../../model/base.js";
import { PictureService } from "../picture/picture.service.js";
import { ProfileService } from "../profile/profile.service.js";

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
		const authService = new AuthService(this.dbClient);
		const pictureService = new PictureService(this.dbClient);

		const interactionList = await this.interactionsModel.findMany([{
			user_id: userId,
			...additionnalInteractionData
		}], ["target_profile_id", "date"]);
		const targetedProfileIds = interactionList.map(element => element.target_profile_id);
		const targetedUsers = await authService.getUsersFromProfileIds(targetedProfileIds);
		const targetProfilePictures = await pictureService.getProfilePicIdsOfProfileIds(targetedProfileIds);
		return interactionList.map(datedProfileIdsList => {
			const targetedUser = targetedUsers.find(user => user.profileId === datedProfileIdsList.target_profile_id);
			return {
				profilePicId: targetProfilePictures.find(pic => pic.profileId === targetedUser.profileId)?.id || undefined,
				username: targetedUser.username,
				lastName: targetedUser.lastName,
				firstName: targetedUser.firstName,
				targetProfileId: targetedUser.profileId,
				date: datedProfileIdsList.date
			}
		});
	}

	async getListWhereCurrentUserIsTarget(
		userId: string,
		additionnalInteractionData?: { [column: string]: any }
	): Promise<Interaction[]> {
		const profileService = new ProfileService(this.dbClient);
		const pictureService = new PictureService(this.dbClient);
		const authService = new AuthService(this.dbClient);

		const currentUserProfileId = (await profileService.getCurrentUserProfile(userId)).id;
		const interactionList = await this.interactionsModel.findMany([{
			target_profile_id: currentUserProfileId,
			...additionnalInteractionData
		}], [ "user_id", "date" ]);
		const interactionListUserIds = interactionList.map(interaction => interaction.user_id);
		const interactionListProfileAndUserIds = await profileService.getProfileIdsFromUserIds(interactionListUserIds);
		const interactionListProfileIds = interactionListProfileAndUserIds.map(ids => ids.id);
		const userList = await authService.getUsersFromProfileIds(interactionListProfileIds);
		const usersProfilePicture = await pictureService.getProfilePicIdsOfProfileIds(interactionListProfileIds);
		return interactionList.map(interaction => {
			const originUser = userList.find(user => user.id === interaction.user_id);
			return {
				profilePicId: usersProfilePicture.find(pic => pic.profileId === originUser.profileId)?.id || undefined,
				username: originUser.username,
				lastName: originUser.lastName,
				firstName: originUser.firstName,
				targetProfileId: originUser.profileId,
				date: interaction.date
			}
		});
	}

	async addElement(
		userId: string,
		targetProfileId: string,
		additionnalData?: { [column: string]: any }
	): Promise<Interaction> {
		const authService = new AuthService(this.dbClient);
		const pictureService = new PictureService(this.dbClient);
		const associatedUser = (await authService.getUsersFromProfileIds([targetProfileId]))[0];
		await this.interactionsModel.create({
			target_profile_id: targetProfileId,
			user_id: userId,
			...additionnalData
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
