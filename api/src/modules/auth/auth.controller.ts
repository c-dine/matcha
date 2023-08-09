import express, { NextFunction } from 'express';
import { Response, Request } from 'express';

export const authController = express();

/*------------- GET -------------*/

authController.get("/", async (req: Request, res: Response, next: NextFunction) => {
	const result = await req.dbClient.query("select * from profile");

	console.log(result)
	res.status(200).json(result);
	next();
});
