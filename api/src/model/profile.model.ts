import { PoolClient } from "pg";
import { ModelBase } from "./base.js";

export class ProfileModel extends ModelBase {

	constructor(dbClient: PoolClient) {
		super("profile", dbClient);
	}
}