import { PoolClient } from "pg";
import { BlacklistModel } from "../../model/blacklist.model.js";
import { Blacklisted } from "@shared-models/blacklist.model.js"

export class BlacklistService {

	dbClient: PoolClient;
	blacklistModel: BlacklistModel;

	constructor(dbClient: PoolClient) {
		this.dbClient = dbClient;
		this.blacklistModel = new BlacklistModel(this.dbClient);
	}

	formatBlacklist(blacklist: blacklist[]): Blacklisted[] {
		return blacklist.map(blacklisted => ({
			blacklistedUserId: blacklisted.blacklisted_user_id,
			date: blacklisted.date
		}));
	}

	async getBlacklist(userId: string): Promise<Blacklisted[]> {
		return this.formatBlacklist(
				await this.blacklistModel.findMany([{ user_id: userId }], ["blacklisted_user_id", "date"])
			);
	}

	async addBlacklisted(userId: string, blacklistedUserId: string) {
		await this.blacklistModel.create({
			blacklisted_user_id: blacklistedUserId,
			user_id: userId
		});
	}

	async deleteBlacklisted(userId: string, blacklistedUserId: string) {
		await this.blacklistModel.delete([{
			blacklisted_user_id: blacklistedUserId,
			user_id: userId
		}]);
	}
}
