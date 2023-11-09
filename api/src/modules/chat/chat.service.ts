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

	async getMessage(notificationId: string): Promise<Message> {
		return this.messageModel.findById(notificationId);
	}

	async getMessages(fromUserId: string, toUSerId: string): Promise<Message[]> {
		return this.messageModel.findMany([
			{ from_user_id: fromUserId, to_user_id: toUSerId},
			{ from_user_id: toUSerId, to_user_id: fromUserId}],
			["id", "from_user_id", "to_user_id", "message", "date"]
		)
	}

	async getConversations(currentUserId: string): Promise<{data: Conversation[]}> {
		const conversations = await this.messageModel.getUserConversations(currentUserId);
		return conversations;
	}

	async postMessage(fromUserId: string, toUserId: string, messageText: string): Promise<Message> {
		return this.messageModel.create({
			from_user_id: fromUserId,
			to_user_id: toUserId,
			message: messageText,
		});
	}

	async view(messageId: string): Promise<Message> {
		return this.messageModel.updateById(messageId, {
			is_viewed: true 
		}
		) as Promise<Message>
	}
}