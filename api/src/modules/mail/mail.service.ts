import { google } from "googleapis";
import nodemailer from 'nodemailer';
import { env, mailConfig } from "../../config/config.js";

export class MailService {

	constructor() {}

	private async createTransporter(): nodemailer.transporter {
		const OAuth2 = google.auth.OAuth2;
		const oauth2Client = new OAuth2(
		mailConfig.clientId,
		mailConfig.secret,
		"https://developers.google.com/oauthplayground"
		);
	
		oauth2Client.setCredentials({
			refresh_token: mailConfig.refreshToken
		});

		const accessToken = await new Promise((resolve, reject) => {
			oauth2Client.getAccessToken((err, token) => {
				if (err)
					reject("Failed to create access token :(");
				resolve(token);
			});
		});

		return nodemailer.createTransport({
			service: "gmail",
			auth: {
				type: "OAuth2",
				user: mailConfig.email,
				accessToken,
				clientId: mailConfig.clientId,
				clientSecret: mailConfig.secret,
				refreshToken: mailConfig.refreshToken
			}
		});
	}

	async sendMail(emailOptions: {
		subject: string,
		html: string,
		to: string,
	}) {
		const transporter = await this.createTransporter();
		await transporter.sendMail({
			...emailOptions,
			from: process.env.EMAIL
		});
	}

	sendResetPasswordMail(email: string) {
		const resetPasswordUrl = `${env.url}`;
		const mailBody =  `
			<p>Hello,</p>
			<p>You've requested a password reset. Click the link below to reset your password:</p>
			<a href="${resetPasswordUrl}" target="_blank">${resetPasswordUrl}</a>
			<p>If you didn't request this reset, please ignore this email.</p>
			<p>Best regards,</p>
			<p>Matcha Team</p>
		`;
		this.sendMail({
			subject: "Password reset",
			to: email,
			html: mailBody
		})
	}

}
