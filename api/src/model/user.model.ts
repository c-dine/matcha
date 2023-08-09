import { PoolClient } from "pg";
import { ModelBase } from "./base";

export class UserModel extends ModelBase {

	constructor(dbClient: PoolClient) {
		super("user", dbClient);
	}

}