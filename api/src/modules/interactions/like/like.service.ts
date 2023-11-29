import { PoolClient } from "pg";
import { InteractionsService } from "../interactions.service.js";

export class LikeService extends InteractionsService {

	constructor(dbClient: PoolClient) {
		super("like", dbClient);
	}
	
	async areUsersMatching(user1: string, user2: string): Promise<boolean> {
		return (await this.interactionsModel.findMany([
			{
				user_id: user1,
				target_user_id: user2
			},
			{
				user_id: user2,
				target_user_id: user1
			}
		])).length === 2;
	}

}
