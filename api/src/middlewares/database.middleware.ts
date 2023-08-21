import { Request, Response, NextFunction } from 'express';
import { dbPool } from '../config/dbConfig.js'
import { CustomError } from '../utils/error.util.js';

export async function connectToDatabase(req: Request, res: Response, next: NextFunction) {
    try {
		req.dbClient = await dbPool.connect();
        next();
    } catch (error) {
        console.error('Error connecting to database:', error);
        next(new CustomError('Internal server error', 500));
    }
};

export async function disconnectFromDatabase(req: Request, res: Response, next: NextFunction) {
	if (req.dbClient)
        req.dbClient.release();
    next();
};
