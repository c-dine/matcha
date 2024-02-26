import { ServiceAccount } from "firebase-admin"

export const encryptionConfig = {
    accessSecret: process.env.ACCESS_SECRET,
    refreshSecret: process.env.REFRESH_SECRET,
	resetPasswordSecret: process.env.RESET_PASSWORD_SECRET,
	resetPasswordIV: process.env.RESET_PASSwORD_INIT_VECTOR,
	mailActivationSecret: process.env.ACTIVATION_ACCOUNT_SECRET,
	mailActivationIV: process.env.ACTIVATION_ACCOUNT_INIT_VECTOR
}

export const env = {
	url: process.env.URL,
	ipLocationKey: process.env.IP_LOCATION_KEY
}

export const mailConfig = {
	email: process.env.EMAIL,
	appPassword: process.env.MAIL_APP_PASSWORD
}

export const firebaseConfig: ServiceAccount = {
	projectId: process.env.FIREBASE_PROJECT_ID,
	privateKey: process.env.FIREBASE_PRIVATE_KEY,
	clientEmail: process.env.FIREBASE_CLIENT_MAIL,
}

const corsFirebase = [
	{
		origin: [
			'*'
		],
		method: [
			'*'
		],
		responseHeader: [
			"Content-Type",
			"Access-Control-Allow-Origin",
			"x-goog-resumable",
		],
		maxAgeSeconds: 3600
	}
];
export const firebaseMetadata = { corsFirebase };