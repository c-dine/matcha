import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { encryptionConfig } from "../config/config.js";
import { CustomError } from "../utils/error.util.js";

export function authenticationHandler(req: Request, res: Response, next: NextFunction) {
    try {
		if (publicRoutes.includes(req.originalUrl))
			return next();

		const token = req.header('Authorization').split(" ")[1];
		const decoded = jwt.verify(token, encryptionConfig.accessSecret);
		if (!token || !(decoded as any)?.userId) 
			throw new Error();
		
		req.userId = (decoded as any)?.userId;
		next();
    } catch (error) {
        console.error('Authentication error:', error);
		next(new CustomError('Authentication error.', 401));
    }
};

const publicRoutes = [
	"/auth/logIn",
	"/auth/signIn",
	"/auth/refreshAccessToken",
	"/auth/resetPassword",
	"/auth/verifyEmail",
	"/auth/resetPassword",
	"/mail/resetPassword"
]