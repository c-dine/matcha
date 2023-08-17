export const encryptionConfig = {
    accessSecret: process.env.ACCESS_SECRET,
    refreshSecret: process.env.REFRESH_SECRET,
	resetPasswordSecret: process.env.RESET_PASSWORD_SECRET,
	resetPasswordIV: process.env.RESET_PASSwORD_INIT_VECTOR,
	mailActivationSecret: process.env.ACTIVATION_ACCOUNT_SECRET,
	mailActivationIV: process.env.ACTIVATION_ACCOUNT_INIT_VECTOR
}

export const env = {
	url: process.env.URL
}

export const mailConfig = {
	clientId: process.env.MAIL_CLIENT_ID,
	secret: process.env.MAIL_SECRET,
	refreshToken: process.env.MAIL_TOKEN,
	email: process.env.EMAIL
}