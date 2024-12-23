import { NewUser, User } from "@shared-models/user.model.js";
import { PoolClient } from "pg";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { decryptToken } from "../../utils/encryption.util.js";
import { encryptionConfig } from "../../config/config.js";
import { CustomError } from "../../utils/error.util.js";
import { UserModel } from "../../model/user.model.js";
import { UserService } from "../user/user.service.js";
import { randomUUID } from "crypto";
import { commonPasswords } from "./passwords-list.js";

export class AuthService {

	dbClient: PoolClient;
	userModel: UserModel;
	userService: UserService;
	
	RESET_PASSWORD_TIME_LIMIT_MINUTES = 15;

	constructor(dbClient: PoolClient) {
		this.dbClient = dbClient;
		this.userModel = new UserModel(dbClient);
		this.userService = new UserService(dbClient);
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

	async createUser(
		userData: NewUser
	): Promise<User> {
		this.passwordIsValidOrThrow(userData.password);
		const newUser = await this.userModel.create({
			username: userData.username,
			last_name: userData.lastName,
			first_name: userData.firstName,
			email: userData.email,
			verified_account: userData.verifiedAccount,
			password: await this.encryptPassword(userData.password)
		}, ["id", "last_name", "first_name", "email", "username"]);
		return newUser ? this.userService.formatUser(newUser) : undefined;
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
			["id", "password"]
		))[0];
		if (!loggedUser || !(await this.areStoredAndReceivedPasswordsEqual(loggedUser.password, userAuthData.password)))
			throw new CustomError("Invalid username or password.", 401);
		return loggedUser ? await this.userService.getFullProfile(loggedUser.id) : undefined;
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
		this.passwordIsValidOrThrow(newPassword);
		const userModel = new UserModel(this.dbClient);
		await userModel.updateById(userId, {
			password: await this.encryptPassword(newPassword)
		});
	}

	passwordIsValidOrThrow(password: string) {
		const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
		if (!passwordRegex.test(password) || commonPasswords.has(password))
			throw new CustomError("Please chose a stronger password.", 400);
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

	// Passport auth, return user id
	async upsertPassportUser(user: { email: string, firstName: string, lastName: string }): Promise<string> {
		let connectedUserId = (await this.userModel.findMany([ { email: user.email } ], ["id"]))[0]?.id
		if (connectedUserId)
			return connectedUserId;
		connectedUserId = (await this.createUser({
			...user,
			verifiedAccount: true,
			password: randomUUID() + '1@-!qN',
			username: user.firstName + user.lastName + randomUUID().slice(0, 20)
		})).id;
		return connectedUserId;
	}
}