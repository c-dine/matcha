import { NextFunction, Request, Response } from "express";

export function authenticationHandler(req: Request, res: Response, next: NextFunction) {
    try {
    } catch (error) {
        console.error('Error connecting to database:', error);
        res.status(401).json({ error: 'Internal server error' });
    }
};