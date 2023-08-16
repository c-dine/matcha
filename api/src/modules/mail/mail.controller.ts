import express, { NextFunction } from 'express';
import { Response, Request } from 'express';
import { MailService } from './mail.service.js';

export const mailController = express();

mailController.post("/resetPassword", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const email = req.body.email;
		const mailService = new MailService();

		await mailService.sendResetPasswordMail(email);

		res.status(200);
	} catch (e: any) {
		console.error(`Error while sending reset password email: ${e}.`);
		res.status(500).json(`Error: ${e}`);
	}
	next();
});
