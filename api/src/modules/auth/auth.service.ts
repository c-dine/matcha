import { NewUser, User } from "@shared-models/user.model.js";
import { UserModel } from '../../model/user.model.js';
import { PoolClient } from "pg";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ProfileModel } from "../../model/profile.model.js";

export class AuthService {

	dbClient: PoolClient;

	constructor(dbClient: PoolClient) {
		this.dbClient = dbClient;
	}

	private formatUser(createdUser: user): User {
		return {
			id: createdUser.id,
			username: createdUser.username,
			lastName: createdUser.last_name,
			firstName: createdUser.first_name,
			email: createdUser.email,
		}
	}

	private async areStoredAndReceivedPasswordsEqual(
		storedHashedPassword: string,
		receivedPlainPassword: string
	) {
		return await bcrypt.compare(receivedPlainPassword, storedHashedPassword);
	}

	private encryptPassword(password: string): Promise<string> {
		return new Promise((resolve, reject) => {
			bcrypt.hash(password, 10, (err, hash) => {
				if (err)
					throw new Error("Error while crypting password.");
				resolve(hash);
			});
		});
	}

	async createUser(
		userData: NewUser
	): Promise<User> {
		const userModel = new UserModel(this.dbClient);
		const profileModel = new ProfileModel(this.dbClient);
		const newUser = await userModel.create({
			username: userData.username,
			last_name: userData.lastName,
			first_name: userData.firstName,
			email: userData.email,
			password: await this.encryptPassword(userData.password)
		}, ["id", "last_name", "first_name", "email", "username"]);
		await profileModel.create({
			user_id: newUser.id
		});
		return this.formatUser(newUser);
	}
	
	async getLoggedUser(
		userAuthData: {
			username: string,
			password: string
		}
	): Promise<User> {
		const userModel = new UserModel(this.dbClient);
		const loggedUser = (
			await userModel.findMany({
				username: userAuthData.username,
			},
			["id", "last_name", "first_name", "email", "username", "password"]
		))[0];
		if (!loggedUser || !this.areStoredAndReceivedPasswordsEqual(loggedUser.password, userAuthData.password))
			throw new Error("Failed authentication.");
		return this.formatUser(loggedUser);
	}
	
	getNewToken(userId: string, secret: string, expireLimitMinutes: number): string {
		return jwt.sign({ userId: userId }, secret, {
			expiresIn: `${expireLimitMinutes}m`,
		});
	}

}