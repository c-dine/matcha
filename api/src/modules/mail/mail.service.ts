import { google } from "googleapis";
import nodemailer from 'nodemailer';
import { encryptionConfig, env, mailConfig } from "../../config/config.js";
import { generateEncryptedToken } from "../../utils/encryption.util.js";

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
				if (err) {
					reject("Failed to create access token :(");
					console.log(err);
				}
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

	sendResetPasswordMail(email: string, userId: string) {
		const resetPasswordUrl = `${env.url}?resetToken=${this.getEncryptedResetPasswordToken(userId)}`;
		const mailBody =  `
			<p>Hello,</p>
			<p>You've requested a password reset. Click the link below to reset your password:</p>
			<a href="${resetPasswordUrl}" target="_blank">${resetPasswordUrl}</a>
			<p>This link will expire in 15 minutes.</p>
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

	private getEncryptedResetPasswordToken(userId: string) {
		return generateEncryptedToken({
				userId,
				timeStamp: Date.now()
			},
			encryptionConfig.resetPasswordSecret,
			encryptionConfig.resetPasswordIV
		);
	}

	sendAccountVerificationMail(email: string, userId: string) {
		const verificationUrl = `${env.url}?verificationToken=${this.getEncryptedAccountVerificationToken(userId, email)}`;
		const mailBody =  `
			<p>Hello,</p>
			<p>Thank you for creating an account with us. Please click the link below to verify your email address:</p>
			<p><a href="${verificationUrl}">${verificationUrl}</a></p>
			<p>If you did not create an account, you can safely ignore this email.</p>
			<p>Best regards,</p>
			<p>Matcha Team</p>
		`;
		this.sendMail({
			subject: "Email verification",
			to: email,
			html: mailBody
		})
	}

	private getEncryptedAccountVerificationToken(userId: string, email: string) {
		return generateEncryptedToken({
				userId,
				email
			},
			encryptionConfig.mailActivationSecret,
			encryptionConfig.mailActivationIV
		);
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

}
