export const config = {
    accessSecret: process.env.ACCESS_SECRET,
    refreshSecret: process.env.REFRESH_SECRET
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