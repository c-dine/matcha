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

export const firebaseConfig = {
	type: "service_account",
	project_id: process.env.FIREBASE_PROJECT_ID,
	private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
	private_key: process.env.FIREBASE_PRIVATE_KEY,
	client_email: process.env.FIREBASE_CLIENT_MAIL,
	client_id: process.env.FIREBASE_CLIENT_ID,
	auth_uri: "https://accounts.google.com/o/oauth2/auth",
	token_uri: "https://oauth2.googleapis.com/token",
	auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
	client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
	universe_domain: "googleapis.com"
  }