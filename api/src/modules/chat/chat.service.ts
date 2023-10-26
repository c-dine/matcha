import { PoolClient } from "pg";
import { MessageModel } from "../../model/message.model.js";
import { Message, Conversation } from "@shared-models/chat.models.js";

export class ChatService {
	dbClient: PoolClient;
	messageModel: MessageModel;

	constructor(dbClient: PoolClient) {
		this.dbClient = dbClient;
		this.messageModel = new MessageModel(this.dbClient);
	}

	async getMessages(fromUserId: string, toUSerId: string): Promise<Message[]> {
		return this.messageModel.findMany([
			{ from_user_id: fromUserId, to_user_id: toUSerId},
			{ from_user_id: toUSerId, to_user_id: fromUserId}],
			["id", "from_user_id", "to_user_id", "message", "date"]
		)
	}

	async getConversations(currentUserId: string): Promise<Conversation[]> {
		// return {
		// 	totalUserCount: matchs.length,
		// 	userList: matchs.map(user => ({
		// 		...this.formatProfile(user as profile),
		// 		...(new AuthService(this.dbClient)).formatUser(user as user),
		// 		tags: user.tags?.split(',') || [],
		// 		picturesIds: {
		// 			profilePicture: user.profile_picture_id,
		// 		},
		// 		userId: user.user_id,
		// 		ditanceKm: user.distance_km
		// 	}))
		// }

		const conversations = 
			await this.messageModel.getUserConversations(currentUserId);
		return conversations.map(conversation => ({
			lastname: conversation.lastname,
			firstname: conversation.firstname,
			profile_id: conversation.profile_id,
			user_id: conversation.user_id,
			picturesIds: {
				profilePicture: conversation.picture_id,
			},
			last_message: conversation.last_message,
			latest_date: conversation.latest_date
		}))
	}

	async postMessage(fromUserId: string, toUserId: string, messageText: string): Promise<Message> {
		return this.messageModel.create({
			from_user_id: fromUserId,
			to_user_id: toUserId,
			message: messageText,
		});
	}
}