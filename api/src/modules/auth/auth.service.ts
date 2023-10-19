import { NewUser, User } from "@shared-models/user.model.js";
import { UserModel } from '../../model/user.model.js';
import { PoolClient } from "pg";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { decryptToken } from "../../utils/encryption.util.js";
import { encryptionConfig } from "../../config/config.js";
import { CustomError } from "../../utils/error.util.js";

export class AuthService {

	dbClient: PoolClient;
	userModel: UserModel;
	
	RESET_PASSWORD_TIME_LIMIT_MINUTES = 15;

	constructor(dbClient: PoolClient) {
		this.dbClient = dbClient;
		this.userModel = new UserModel(dbClient);
	}

	formatUser(createdUser: user): User {
		return {
			id: createdUser?.id,
			username: createdUser?.username,
			lastName: createdUser?.last_name,
			firstName: createdUser?.first_name,
			email: createdUser?.email,
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
					throw new Error();
				resolve(hash);
			});
		});
	}

	async getUser(
		whereQuery: { [ key: string ]: any },
		select?: string[]
	) {
		const user = (
			await this.userModel.findMany([whereQuery],
			select
		))[0];
		return user ? this.formatUser(user) : undefined;
	}

	async createUser(
		userData: NewUser
	): Promise<User> {
		const newUser = await this.userModel.create({
			username: userData.username,
			last_name: userData.lastName,
			first_name: userData.firstName,
			email: userData.email,
			password: await this.encryptPassword(userData.password)
		}, ["id", "last_name", "first_name", "email", "username"]);
		return newUser ? this.formatUser(newUser) : undefined;
	}
	
	async updateUser(updatedUser: User, userId: string) {
		await this.userModel.updateById(userId, {
			first_name: updatedUser.firstName,
			last_name: updatedUser.lastName,
			email: updatedUser.email,
			username: updatedUser.username
		});
	}

	async getLoggedUser(
		userAuthData: {
			username?: string,
			id?: string,
			password: string
		}
	): Promise<User> {
		const loggedUser = (
			await this.userModel.findMany([
				{ username: userAuthData.username, },
				{ id: userAuthData.id, }
			],
			["id", "last_name", "first_name", "email", "username", "password"]
		))[0];
		if (!loggedUser || !(await this.areStoredAndReceivedPasswordsEqual(loggedUser.password, userAuthData.password)))
			throw new CustomError("Invalid username or password.", 401);
		return loggedUser ? this.formatUser(loggedUser) : undefined;
	}
	
	getNewToken(userId: string, secret: string, expireLimitMinutes: number): string {
		return jwt.sign({ userId: userId }, secret, {
			expiresIn: `${expireLimitMinutes}m`,
		});
	}

	async resetPassword(resetToken: string, password: string) {
		const decodedToken = decryptToken(resetToken, encryptionConfig.resetPasswordSecret, encryptionConfig.resetPasswordIV);
		
		if (Date.now() - new Date(decodedToken.timeStamp).getTime() > this.RESET_PASSWORD_TIME_LIMIT_MINUTES * 60 * 1000)
			throw new CustomError("Expired link.", 403);
		
		await this.updatePassword(password, decodedToken.userId);
	}

	async updatePassword(newPassword: string, userId: string) {
		const userModel = new UserModel(this.dbClient);
		await userModel.updateById(userId, {
			password: await this.encryptPassword(newPassword)
		});
	}

	async verifyEmail(verificationToken: string) : Promise<boolean> {
		const decodedToken = decryptToken(
			verificationToken,
			encryptionConfig.mailActivationSecret,
			encryptionConfig.mailActivationIV
		);
		const userModel = new UserModel(this.dbClient);
		const updatedUsers = await userModel.update([{
			id: decodedToken.userId,
			email: decodedToken.email
		}], {
			verified_account: true
		}, ["id"]);

		return !!updatedUsers[0];
	}

}