import { PoolClient } from "pg";
import { MessageModel } from "../../model/message.model.js";
import { Message, Conversation } from "@shared-models/chat.models.js";

export class ChatService {
	dbClient: PoolClient;
	profileModel: MessageModel;

	constructor(dbClient: PoolClient) {
		this.dbClient = dbClient;
		this.profileModel = new MessageModel(this.dbClient);
	}

	async getMessages(fromUserId: string, toUserId: string): Promise<Message[]> {
		return this.profileModel.findMany([
			{ from: fromUserId, to: toUserId},
			{ from: toUserId, to: fromUserId}],
			["id", "from_user_id", "to_user_id", "message", "date"]
		)
	}

	async getConversations(fromUserId: string, toUserId: string): Promise<Conversation[]> {
		return [];
	}

	async postMessage(fromUserId: string, toUserId: string, messageText: string): Promise<Message> {
		return this.profileModel.create({
			from: fromUserId,
			to: toUserId,
			message: messageText,
		});
	}
}