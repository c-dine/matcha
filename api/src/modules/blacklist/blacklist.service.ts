import { PoolClient } from "pg";
import { BlacklistModel } from "../../model/blacklist.model.js";

export class BlacklistService {

	dbClient: PoolClient;
	blacklistModel: BlacklistModel;
	profileBlacklistAssoModel: BlacklistModel;

	constructor(dbClient: PoolClient) {
		this.dbClient = dbClient;
		this.blacklistModel = new BlacklistModel(this.dbClient);
	}

	getBlacklist(profileId: string) {

	}

	addBlacklist(userId: string, blacklistedUserId: string) {

	}

	deleteBlacklisted(userId: string, blacklistedUserId: string) {

	}
}
