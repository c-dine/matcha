import { PoolClient } from "pg";
import { ModelBase } from "./base.js";

export class BlacklistModel extends ModelBase {

	constructor(dbClient: PoolClient) {
		super("blacklist", dbClient);
	}
}
