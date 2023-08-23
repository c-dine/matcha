import { Router } from 'express';
import { authController } from './modules/auth/auth.controller.js';
import { mailController } from './modules/mail/mail.controller.js';
import { profileController } from './modules/profile/profile.controller.js';
import { tagController } from './modules/tag/tag.controller.js';
import { pictureController } from './modules/picture/picture.controller.js';

export const routes: { [route: string]: Router } = {
    "/auth": authController,
    "/profile": profileController,
	"/mail": mailController,
	"/picture": pictureController,
	"/tag": tagController
}