import { PoolClient } from "pg";
import { ModelBase } from "./base.js";
import { User } from "@shared-models/user.model.js";

export class UserModel extends ModelBase {

	constructor(dbClient: PoolClient) {
		super("user", dbClient);
	}

	async create(createdData: { [key: string]: any; }, select?: string[]): Promise<User> {
		const createdUser = await super.create(createdData);
		return this.formatUser(createdUser);
	}

	formatUser(createdUser: user): User {
		return {
			id: createdUser.id,
			username: createdUser.username,
			lastName: createdUser.last_name,
			firstName: createdUser.first_name,
			email: createdUser.email
		}
	}
}