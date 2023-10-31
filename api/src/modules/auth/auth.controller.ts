import express, { NextFunction } from 'express';
import { Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import { encryptionConfig } from '../../config/config.js';
import { NewUser, User } from '@shared-models/user.model.js'
import { AuthService } from './auth.service.js';
import { MailService } from '../mail/mail.service.js';
import { CustomError } from '../../utils/error.util.js';
import { UserService } from '../user/user.service.js';

export const authController = express();

authController.post("/signIn", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userData: NewUser = req.body;
		const authService = new AuthService(req.dbClient);
		const newUser = await authService.createUser(userData);
		const accessToken = authService.getNewToken(newUser.id, encryptionConfig.accessSecret, 15);
		const refreshToken = authService.getNewToken(newUser.id, encryptionConfig.refreshSecret, 12000);
		const mailService = new MailService();
		await mailService.sendAccountVerificationMail(newUser.email, newUser.id);

		next();
		res.status(201).json({
			message: "Successfully signed in.",
			data: {
				...newUser,
				token: {
					access: accessToken,
					refresh: refreshToken
				}
			}
		});
	} catch (error: any) {
		console.error(`Error while creating user: ${error}`);
		error.message = "Username or email already taken."; 
		next(error);
	}
});

authController.post("/logIn", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userAuthData = req.body;
		const authService = new AuthService(req.dbClient);
		const loggedUser = await authService.getLoggedUser(userAuthData);
		const accessToken = authService.getNewToken(loggedUser.id, encryptionConfig.accessSecret, 15);
		const refreshToken = authService.getNewToken(loggedUser.id, encryptionConfig.refreshSecret, 12000);

		res.status(200).json({
			message: "Successfully logged in.",
			data: {
				...loggedUser,
				token: {
					access: accessToken,
					refresh: refreshToken
				}
			}
		})
		next();
	} catch (error: any) {
		console.error(`Error while logging in: ${error}`);
		error.message = error.message || "Error while logging in."; 
		next(error);
	}
});

authController.post("/refreshAccessToken", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const refreshToken = req.body.refreshToken;
		const authService = new AuthService(req.dbClient);
		const userService = new UserService(req.dbClient);

		if (!refreshToken)
			throw new CustomError("Authentication error.", 400);
		await jwt.verify(refreshToken, encryptionConfig.refreshSecret, async (err, decoded) => {
			const user = await userService.getUserById((decoded as any)?.userId);
			if (err || !user)
				throw new CustomError("Authentication error.", 401);

			res.status(200).json({
				data: {
					token: {
						access: authService.getNewToken(decoded.userId, encryptionConfig.accessSecret, 15)
					},
					... await userService.getFullProfile(user.id)
				}
			});
		});
		next();
	} catch (error: any) {
		console.error(`Error while refreshing access token: ${error}`);
		error.message = "Authentication error."; 
		next(error);
	}
});

authController.post("/resetPassword", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const resetToken = req.body.resetToken;
		const password = req.body.password;
		const authService = new AuthService(req.dbClient);

		await authService.resetPassword(resetToken, password);

		res.status(200).json({ message: "Password successfully reset."});
		next();
	} catch (error: any) {
		console.error(`Error while reseting password: ${error}`);
		error.message = error.message || "Error while reseting password."; 
		next(error);
	}
});

authController.post("/verifyEmail", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const verificationToken = req.body.verificationToken;
		const authService = new AuthService(req.dbClient);
		const emailIsValid = await authService.verifyEmail(verificationToken);
		
		if (!emailIsValid)
			throw new Error();
		res.status(200).json({ message: "Email successfully verified."});
		next();
	} catch (error: any) {
		console.error(`Error while verifying email: ${error}`);
		error.message = "Error while verifying email."; 
		next(error);
	}
});

authController.put("/updatePassword", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const newPassword = req.body.newPassword;
		const lastPassword = req.body.lastPassword;
		const userId = req.userId;
		const authService = new AuthService(req.dbClient);

		try {
			await authService.getLoggedUser({ id: userId, password: lastPassword });
		} catch (e: any) {
			throw new CustomError("Last password doesn't match the one stored in the database.", 400);
		}
		await authService.updatePassword(newPassword, userId);

		res.status(200).json({ message: "Password successfully updated."});
		next();
	} catch (error: any) {
		console.error(`Error while updating password: ${error}`);
		error.message = error.message || "Error while updating password.";
		next(error);
	}
});
