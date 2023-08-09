import express from 'express';
import { Response, Request } from 'express';

export const authController = express();

/*------------- GET -------------*/

authController.get("/", async (req: Request, res: Response) => {
	res.status(200).json("OK!")
});