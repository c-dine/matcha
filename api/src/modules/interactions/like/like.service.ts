import { PoolClient } from "pg";
import { InteractionsService } from "../interactions.service.js";

export class LikeService extends InteractionsService {

	constructor(dbClient: PoolClient) {
		super("like", dbClient);
	}
	
}
