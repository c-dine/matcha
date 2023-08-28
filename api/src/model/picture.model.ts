import { PoolClient } from "pg";
import { ModelBase } from "./base.js";

export class PictureModel extends ModelBase {

	constructor(dbClient: PoolClient) {
		super("picture", dbClient);
	}
}
