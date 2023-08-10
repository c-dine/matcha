export interface User {
    id?: string;
    lastName?: string;
    firstName?: string;
    email?: string;
    username: string,
}

export interface CurrentUser extends User {
    profilePictureUrl?: string,
}

export interface AuthenticatedUser extends CurrentUser {
    token: {
        refresh: string,
        access: string
    }
}

export interface NewUser extends User{
    password: string
}