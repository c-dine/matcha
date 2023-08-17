import express, { NextFunction } from 'express';
import { Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import { encryptionConfig } from '../../config/config.js';
import { NewUser } from '@shared-models/user.model.js'
import { AuthService } from './auth.service.js';
import { MailService } from '../mail/mail.service.js';

export const authController = express();

authController.post("/signIn", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userData: NewUser = req.body;
		const authService = new AuthService(req.dbClient);
		const newUser = await authService.createUser(userData);
		const accessToken = authService.getNewToken(newUser.id, encryptionConfig.accessSecret, 15);
		const refreshToken = authService.getNewToken(newUser.id, encryptionConfig.refreshSecret, 12000);
		const mailService = new MailService();
		mailService.sendAccountVerificationMail(newUser.email, newUser.id);

		res.status(201).json({
			...newUser,
			token: {
				access: accessToken,
				refresh: refreshToken
			}
		});
	} catch (e: any) {
		console.error("Error while creating user.");
		res.status(400).json(undefined);
	}
	next();
});

authController.post("/logIn", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userAuthData = req.body;
		const authService = new AuthService(req.dbClient);
		const loggedUser = await authService.getLoggedUser(userAuthData);
		const accessToken = authService.getNewToken(loggedUser.id, encryptionConfig.accessSecret, 15);
		const refreshToken = authService.getNewToken(loggedUser.id, encryptionConfig.refreshSecret, 12000);

		res.status(200).json({
			...loggedUser,
			token: {
				access: accessToken,
				refresh: refreshToken
			}
		})
	} catch (e: any) {
		console.error("Error while logging in.");
		res.status(401).json(undefined);
	}
	next();
});

authController.post("/refreshAccessToken", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const refreshToken = req.body.refreshToken;
		const authService = new AuthService(req.dbClient);

		jwt.verify(refreshToken, encryptionConfig.refreshSecret, (err, decoded) => {
			if (err)
				return res.status(401).json(undefined);

			res.status(200).json(authService.getNewToken(decoded.userId, encryptionConfig.accessSecret, 15));
		});
	} catch (e: any) {
		console.error("Error while refreshing access token.");
		res.status(500).json(`Error: ${e}`);
	}
	next();
});

authController.post("/resetPassword", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const resetToken = req.body.resetToken;
		const password = req.body.password;
		const authService = new AuthService(req.dbClient);

		await authService.resetPassword(resetToken, password, req.dbClient);

		res.status(200).json();
	} catch (e: any) {
		console.error("Error while reseting password.");
		res.status(500).json(`Error: ${e}`);
	}
	next();
});


authController.post("/verifyEmail", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const verificationToken = req.body.verificationToken;
		const authService = new AuthService(req.dbClient);
		const emailIsValid = await authService.verifyEmail(verificationToken, req.dbClient);
		
		if (emailIsValid)
			res.status(200).json("Account verified.");
		else
			res.status(200).json(undefined);
	} catch (e: any) {
		console.error("Error while verifying email.");
		res.status(200).json(undefined);
	}
	next();
});
