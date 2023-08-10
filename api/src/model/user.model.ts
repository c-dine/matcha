import { PoolClient } from "pg";
import { ModelBase } from "./base.js";
import { User } from "@shared-models/user.model.js";

export class UserModel extends ModelBase {

	constructor(dbClient: PoolClient) {
		super("user", dbClient);
	}
}