import express, { NextFunction } from 'express';
import { Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../config/config.js';
import { NewUser } from '@shared-models/user.model.js'
import { AuthService } from './auth.service.js';

export const authController = express();

authController.post("/signIn", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userData: NewUser = req.body;
		const authService = new AuthService(req.dbClient);
		const newUser = await authService.createUser(userData);
		const accessToken = authService.getNewToken(newUser.id, config.accessSecret, 15);
		const refreshToken = authService.getNewToken(newUser.id, config.refreshSecret, 12000);

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
		const accessToken = authService.getNewToken(loggedUser.id, config.accessSecret, 15);
		const refreshToken = authService.getNewToken(loggedUser.id, config.refreshSecret, 12000);

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

		jwt.verify(refreshToken, config.refreshSecret, (err, decoded) => {
			if (err)
				return res.status(401).json(undefined);

			res.status(200).json(authService.getNewToken(decoded.userId, config.accessSecret, 15));
		});
	} catch (e: any) {
		console.error("Error while refreshing access token.");
		res.status(500).json(`Error: ${e}`);
	}
	next();
});
