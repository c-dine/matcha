import { Request, Response, NextFunction } from 'express';
import { dbPool } from '../config/dbConfig.js'

export async function connectToDatabase(req: Request, res: Response, next: NextFunction) {
    try {
        req.dbClient = await dbPool.connect();
        next();
    } catch (error) {
        console.error('Error connecting to database:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export async function disconnectFromDatabase(req: Request, res: Response, next: NextFunction) {
    if (req.dbClient)
        req.dbClient.release();
    next();
};
