import { PoolClient } from "pg";
import { ModelBase } from "./base.js";

export class MessageModel extends ModelBase {

	constructor(dbClient: PoolClient) {
		super("message", dbClient);
	}
}
