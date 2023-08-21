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
		error.message = error.message || "Error while creating user."; 
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
		console.log("Passing control to error handler.")
		next(error);
	}
});

authController.post("/refreshAccessToken", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const refreshToken = req.body.refreshToken;
		const authService = new AuthService(req.dbClient);

		jwt.verify(refreshToken, encryptionConfig.refreshSecret, (err, decoded) => {
			if (err)
				return res.status(401).json(undefined);

			res.status(200).json({
				data: authService.getNewToken(decoded.userId, encryptionConfig.accessSecret, 15)
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

		await authService.resetPassword(resetToken, password, req.dbClient);

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
		const emailIsValid = await authService.verifyEmail(verificationToken, req.dbClient);
		
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
