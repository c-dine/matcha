import { PoolClient } from "pg";
import { InteractionsService } from "../interactions.service.js";
import { Interaction } from "@shared-models/interactions.model.js";

export class LikeService extends InteractionsService {

	constructor(dbClient: PoolClient) {
		super("like", dbClient);
	}
	
}
