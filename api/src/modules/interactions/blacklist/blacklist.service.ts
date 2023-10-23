import { PoolClient } from "pg";
import { InteractionsService } from "../interactions.service.js";

export class BlacklistService extends InteractionsService {

	constructor(dbClient: PoolClient) {
		super("blacklist", dbClient);
	}

}
