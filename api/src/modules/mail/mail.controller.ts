import express, { NextFunction } from 'express';
import { Response, Request } from 'express';
import { MailService } from './mail.service.js';
import { UserService } from '../user/user.service.js';

export const mailController = express();

mailController.post("/resetPassword", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const email = req.body.email;  
		const mailService = new MailService();
		const userService = new UserService(req.dbClient);
		const linkedUser = (await userService.getUsers({ email }, [ "id" ]))[0];

		if (linkedUser)
			await mailService.sendResetPasswordMail(email, linkedUser.id);

		res.status(200).json({ message: "Reset password mail successfully sent." });
		next();
	} catch (error: any) {
		console.error(`Error while sending reset password email: ${error}.`);
		error.message = error.message || `Error while sending reset password email.`;
		next(error);
	}
});
