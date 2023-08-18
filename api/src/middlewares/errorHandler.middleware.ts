import { NextFunction, Request, Response } from "express";
import { CustomError } from "../utils/error.util";

export function errorHandler(error: CustomError, req: Request, res: Response, next: NextFunction) {
	const statusCode = (error as CustomError).statusCode || 500;
	const errorMessage = error.message || "Internal server error.";
	res.status(statusCode).json({ error: errorMessage });
	next();
}