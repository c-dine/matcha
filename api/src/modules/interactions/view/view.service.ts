import { PoolClient } from "pg";
import { InteractionsService } from "../interactions.service.js";

export class ViewService extends InteractionsService {

	constructor(dbClient: PoolClient) {
		super("view", dbClient);
	}

}
