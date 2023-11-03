import { PoolClient } from "pg";
import { ModelBase } from "./base.js";

export class UserTagAssoModel extends ModelBase {

	constructor(dbClient: PoolClient) {
		super("user_tag_asso", dbClient);
	}
}
