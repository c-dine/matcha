export interface User {
	id?: string;
	lastName?: string;
	firstName?: string;
	email?: string;
	username: string;
}

export interface AuthenticatedUser extends User {
	token: {
		refresh: string,
		access: string
	}
}

export interface NewUser extends User {
	password: string
}