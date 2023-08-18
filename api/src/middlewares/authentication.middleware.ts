import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { encryptionConfig } from "../config/config.js";

export function authenticationHandler(req: Request, res: Response, next: NextFunction) {
    try {
		if (publicRoutes.includes(req.originalUrl))
			return next();

		const token = req.header('Authorization').split(" ")[1];
		const decoded = jwt.verify(token, encryptionConfig.accessSecret);
		if (!token || !decoded?.userId) 
			throw new Error();
		
		req.userId = decoded.userId;
		next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ error: 'Authentication error.' });
    }
};

const publicRoutes = [
	"/auth/logIn",
	"/auth/signIn",
	"/auth/refreshAccessToken",
	"/auth/resetPassword",
	"/auth/verifyEmail",
	"/auth/resetPassword"
]