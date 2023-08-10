import { NewUser, User } from "@shared-models/user.model.js";
import { UserModel } from '../../model/user.model.js';
import { PoolClient } from "pg";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function createUser(
    userData: NewUser,
    dbClient: PoolClient
): Promise<user> {
    const userModel = new UserModel(dbClient);
    const newUser = await userModel.create({
        username: userData.username,
        last_name: userData.lastName,
        first_name: userData.firstName,
        email: userData.email,
        password: await encryptPassword(userData.password)
    }, ["id", "last_name", "first_name", "email", "username"]);
    return newUser;
}

export async function getLoggedUser(
    userAuthData: {
        username: string,
        password: string
    }, 
    dbClient: PoolClient
): Promise<user> {
    const userModel = new UserModel(dbClient);
    const loggedUser = (
        await userModel.findMany({
            username: userAuthData.username,
        },
        ["id", "last_name", "first_name", "email", "username", "password"]
    ))[0];
    if (!loggedUser || !areStoredAndReceivedPasswordsEqual(loggedUser.password, userAuthData.password))
        throw new Error("Failed authentication.");
    return loggedUser;
}

async function areStoredAndReceivedPasswordsEqual(
    storedHashedPassword: string,
    receivedPlainPassword: string
) {
    return await bcrypt.compare(receivedPlainPassword, storedHashedPassword);
}

function encryptPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, (err, hash) => {
            if (err)
                throw new Error("Error while crypting password.");
            resolve(hash);
        });
    });
}

export function getNewToken(userId: string, secret: string, expireLimitMinutes: number): string {
    return jwt.sign({ userId: userId }, secret, {
        expiresIn: `${expireLimitMinutes}m`,
    });
}

export function formatUser(createdUser: user): User {
    return {
        id: createdUser.id,
        username: createdUser.username,
        lastName: createdUser.last_name,
        firstName: createdUser.first_name,
        email: createdUser.email,
    }
}