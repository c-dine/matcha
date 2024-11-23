import { PoolClient } from "pg";
import { InteractionsService } from "../interactions.service.js";
import { UserList } from "@shared-models/user.model.js";
import { NotificationWithAuthor } from "@shared-models/notification.model.js";
import { Blacklist, Like } from "@shared-models/common.models.js";
import { Event, Interaction } from '@shared-models/interactions.model.js';

export class BlacklistService extends InteractionsService {

	constructor(dbClient: PoolClient) {
		super("blacklist", dbClient);
	}

	async hasBlacklistBetweenUsers(firstUserId: string, secondUserId: string): Promise<boolean> {
		const firstUserBlockedSecond = await this.isBlacklistedBy(secondUserId, firstUserId);
		const secondUserBlockedFirst = await this.isBlacklistedBy(firstUserId, secondUserId);
		return firstUserBlockedSecond || secondUserBlockedFirst;
	}

	async isBlacklistedBy(blacklistedUserId: string, actorUserId: string): Promise<boolean> {
		const blacklist = await this.interactionsModel.findMany([{
			user_id: actorUserId,
			target_user_id: blacklistedUserId
		}]);
		return blacklist.length > 0;
	}

	async excludeCombinedBlacklistFromUserList(userList: UserList, currentUserId: string): Promise<UserList> {
		const combinedBlacklist = await this.combineBlacklists(currentUserId);
		const usersWithoutBlacklist = userList.userList.filter(
			user => !combinedBlacklist.some(blacklistUser => blacklistUser.targetUserId === user.id)
		);
		return {
			totalUserCount: userList.totalUserCount,
			userList: usersWithoutBlacklist
		};
	}

	async excludeCombinedBlacklistFromNotifications(notifications: NotificationWithAuthor[], currentUserId: string): Promise<NotificationWithAuthor[]> {
		const combinedBlacklist = await this.combineBlacklists(currentUserId);
		const notificationsWithoutBlacklist = notifications.filter(
			notification => !combinedBlacklist.some(
				blacklistUser => blacklistUser.targetUserId === notification.notification?.to_user_id
				|| blacklistUser.targetUserId === notification.notification?.from_user_id
			)
		);
		return notificationsWithoutBlacklist;
	}

	async excludeBlacklistFromEventList(eventList: Event[], currentUserId: string): Promise<Event[]> {
		const combinedBlacklist = await this.combineBlacklists(currentUserId);
		const eventsWithoutBlacklist = eventList.filter(
			event => !combinedBlacklist.some(
				blacklistUser => blacklistUser.targetUserId === event.userId
				|| blacklistUser.targetUserId === event.targetUserId
			)
		);
		return eventsWithoutBlacklist;
	}

	async excludeBlacklistFromInteractionList(interactionList: Interaction[], currentUserId: string): Promise<Interaction[]> {
		const combinedBlacklist = await this.combineBlacklists(currentUserId);
		const interactionsWithoutBlacklist = interactionList.filter(
			interaction => !combinedBlacklist.some(
				blacklistUser => blacklistUser.targetUserId === interaction.targetUserId
			)
		);
		return interactionsWithoutBlacklist;
	}

	private async combineBlacklists(currentUserId: string): Promise<Blacklist[]> {
		const currentUserBlacklisters = await this.getListWhereCurrentUserIsTarget(currentUserId);
		const blacklistedUsers = await this.getList(currentUserId);
		return [...currentUserBlacklisters, ...blacklistedUsers];
	}
}


