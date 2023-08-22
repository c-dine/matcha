import { PoolClient } from "pg";
import { ModelBase } from "./base.js";

export class TagModel extends ModelBase {

	constructor(dbClient: PoolClient) {
		super("tag", dbClient);
	}
}
