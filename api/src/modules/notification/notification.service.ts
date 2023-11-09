import { PoolClient } from "pg";
import { NotificationModel } from "../../model/notification.model.js";
import { NotificationWithAuthor } from "@shared-models/notification.model.js";
import { Notification } from "@shared-models/common.models.js";

export class NotificationService {
	dbClient: PoolClient;
	notificationModel: NotificationModel;

	constructor(dbClient: PoolClient) {
		this.dbClient = dbClient;
		this.notificationModel = new NotificationModel(this.dbClient);
	}

	async getNotification(notificationId: string): Promise<Notification> {
		return this.notificationModel.findById(notificationId);
	}

	async getNotificationsWithAuthor(currentUserId: string): Promise<{data: NotificationWithAuthor[]}> {
		return this.notificationModel.getNotifications(currentUserId);
	}

	async postNotification(fromUserId: string, toUserId: string, type: string): Promise<Notification> {
		return this.notificationModel.create({
			from_user_id: fromUserId,
			to_user_id: toUserId,
			type: type,
		});
	}

	async view(notificationId: string): Promise<Notification> {
		return this.notificationModel.updateById(notificationId, {
			is_viewed: true 
		}
		) as Notification
	}
}