import nodemailer from 'nodemailer';
import { encryptionConfig, env, mailConfig } from "../../config/config.js";
import { generateEncryptedToken } from "../../utils/encryption.util.js";
import { CustomError } from "../../utils/error.util.js";

export class MailService {

	constructor() { }

	private async createTransporter(): nodemailer.transporter {
		return nodemailer.createTransport({
			service: "Gmail",
			host: "smtp.gmail.com",
			port: 465,
			secure: true,
			auth: {
				user: mailConfig.email,
				pass: mailConfig.appPassword
			},
		});
	}

	async sendResetPasswordMail(email: string, userId: string, username: string) {
		const resetPasswordUrl = `${env.url}?resetToken=${this.getEncryptedResetPasswordToken(userId)}`;
		const mailBody = `
			<p>Hi ${username},</p>
			<p>You've requested a password reset. Click the link below to reset your password:</p>
			<a href="${resetPasswordUrl}" target="_blank">${resetPasswordUrl}</a>
			<p>This link will expire in 15 minutes.</p>
			<p>If you didn't request this reset, please ignore this email.</p>
			<p>Best regards,</p>
			<p>Matcha Team</p>		
		`;
		await this.sendMail({
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

	async sendAccountVerificationMail(email: string, userId: string) {
		const verificationUrl = `${env.url}?verificationToken=${this.getEncryptedAccountVerificationToken(userId, email)}`;
		const mailBody = `
			<p>Hello,</p>
			<p>Thank you for creating an account with us. Please click the link below to verify your email address:</p>
			<p><a href="${verificationUrl}">${verificationUrl}</a></p>
			<p>If you did not create an account, you can safely ignore this email.</p>
			<p>Best regards,</p>
			<p>Matcha Team</p>
		`;
		await this.sendMail({
			subject: "Email verification",
			to: email,
			html: mailBody
		});
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
		try {
			const transporter = await this.createTransporter();
			await transporter.sendMail({
				...emailOptions,
				from: process.env.EMAIL
			});
		} catch (error: any) {
			throw new CustomError("Error sending mail.", 500);
		}
	}

}
