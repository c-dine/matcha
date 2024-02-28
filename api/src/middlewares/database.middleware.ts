import { Request, Response, NextFunction } from 'express';

export async function disconnectFromDatabase(req: Request, res: Response, next: NextFunction) {
	if (req.dbClient)
        req.dbClient.release();
};
