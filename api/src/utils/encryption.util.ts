import crypto from "crypto";

export function generateEncryptedToken(
	dataToEncrypt: any,
	secret: string,
	IV: string
): string {
	const token = JSON.stringify(dataToEncrypt);
	const cipher = crypto.createCipheriv(
		'aes-256-cbc',
		secret,
		IV
	);
	let encryptedToken = cipher.update(token, 'utf8', 'hex');

	encryptedToken += cipher.final('hex');
	return encryptedToken;
}
  
export function decryptToken(
	encryptedToken: string,
	secret: string,
	IV: string
): any {
	const decipher = crypto.createDecipheriv(
		'aes-256-cbc',
		secret,
		IV
	);
	let decryptedToken = decipher.update(encryptedToken, 'hex', 'utf8');
	
	decryptedToken += decipher.final('utf8');
	return JSON.parse(decryptedToken);
}