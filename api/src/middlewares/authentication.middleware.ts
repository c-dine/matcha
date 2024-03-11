import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { encryptionConfig } from "../config/config.js";
import { CustomError } from "../utils/error.util.js";
import { dbPool } from "../config/dbConfig.js";

export async function authenticationHandler(req: Request, res: Response, next: NextFunction) {
    try {
		req.dbClient = await dbPool.connect();
		if (publicRoutes.includes(req.originalUrl.split("?")[0]))
			return next();

		if (req.isAuthenticated()) {
			req.userId = (req.user as any).id;
			next();
		}
		const token = req.header('Authorization')?.split(" ")[1];
		const decoded = jwt.verify(token, encryptionConfig.accessSecret);
		if (!token || !(decoded as any)?.userId) 
			throw new Error();
		
		req.userId = (decoded as any)?.userId;
		next();
    } catch (error) {
		next(new CustomError('Authentication error.', 401));
    }
};

const publicRoutes = [
	"/auth/logIn",
	"/auth/logOut",
	"/auth/signIn",
	"/auth/refreshAccessToken",
	"/auth/resetPassword",
	"/auth/verifyEmail",
	"/auth/resetPassword",
	"/mail/resetPassword",
	"/auth/google",
	"/auth/google/callback",
	"/auth/success",
	"/auth/error",
]