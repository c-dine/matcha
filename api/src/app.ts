import { routes } from "./routes.js";
import express from 'express';
import * as dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { connectToDatabase, disconnectFromDatabase } from "./middlewares/database.middleware.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import { authenticationHandler } from "./middlewares/authentication.middleware.js";
import admin from 'firebase-admin';
import { env, firebaseConfig, firebaseMetadata } from "./config/config.js";
import cors from 'cors';

dotenv.config();

const app = express();

admin.initializeApp({
	credential: admin.credential.cert(firebaseConfig),
	storageBucket: process.env.FIREBASE_STORAGE_URL
});

export const bucket = admin.storage().bucket();
bucket.setMetadata(firebaseMetadata);

app.use(cors({
	origin: env.url
}));
app.set("trust proxy", true);

app.use(bodyParser.json());
app.use(authenticationHandler)
app.use(connectToDatabase);

for (const route in routes) app.use(route, routes[route]);

app.use(errorHandler);
app.use(disconnectFromDatabase);

app.listen(3000, () => {
});
