import { routes } from "./routes.js";
import express from 'express';
import * as dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { disconnectFromDatabase } from "./middlewares/database.middleware.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import { authenticationHandler } from "./middlewares/authentication.middleware.js";
import admin from 'firebase-admin';
import { encryptionConfig, env, firebaseConfig, firebaseMetadata, passportConfig } from "./config/config.js";
import cors from 'cors';
import passport from "passport";
import session from 'express-session';
import './passportStrategies/google.js'

dotenv.config();

const app = express();

// Firebase
admin.initializeApp({
	credential: admin.credential.cert(firebaseConfig),
	storageBucket: process.env.FIREBASE_STORAGE_URL
});
export const bucket = admin.storage().bucket();
bucket.setMetadata(firebaseMetadata);

// Passport strategies
app.use(session({
	resave: false,
	saveUninitialized: true,
	secret: encryptionConfig.accessSecret
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
	origin: env.url
}));
app.set("trust proxy", true);

app.use(bodyParser.json());
app.use(authenticationHandler)

for (const route in routes) app.use(route, routes[route]);

app.use(errorHandler);
app.use(disconnectFromDatabase);

app.listen(3000, () => {
});
