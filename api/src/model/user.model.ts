import { PoolClient } from "pg";
import { ModelBase } from "./base.js";

export class UserModel extends ModelBase {

	constructor(dbClient: PoolClient) {
		super("user", dbClient);
	}
}