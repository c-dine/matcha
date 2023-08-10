import express, { NextFunction } from 'express';
import { Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../config/config.js';
import { NewUser } from '@shared-models/user.model.js'
import { createUser, getNewToken, getLoggedUser, formatUser } from './auth.service.js';

export const authController = express();

authController.post("/signIn", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userData: NewUser = req.body;
		const newUser = await createUser(userData, req.dbClient);
		const accessToken = getNewToken(newUser.id, config.accessSecret, 15);
		const refreshToken = getNewToken(newUser.id, config.refreshSecret, 12000);

		res.status(201).json({
			...formatUser(newUser),
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
		const loggedUser = await getLoggedUser(userAuthData, req.dbClient);
		const accessToken = getNewToken(loggedUser.id, config.accessSecret, 15);
		const refreshToken = getNewToken(loggedUser.id, config.refreshSecret, 12000);

		res.status(200).json({
			...formatUser(loggedUser),
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

		jwt.verify(refreshToken, config.refreshSecret, (err, decoded) => {
			if (err)
				return res.status(401).json(undefined);

			res.status(200).json(getNewToken(decoded.userId, config.accessSecret, 15));
		});
	} catch (e: any) {
		console.error("Error while refreshing access token.");
		res.status(500).json(`Error: ${e}`);
	}
	next();
});
