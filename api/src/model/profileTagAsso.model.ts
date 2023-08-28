import { PoolClient } from "pg";
import { ModelBase } from "./base.js";

export class ProfileTagAssoModel extends ModelBase {

	constructor(dbClient: PoolClient) {
		super("profile_tag_asso", dbClient);
	}
}
