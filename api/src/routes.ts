import { Router } from 'express';
import { authController } from './modules/auth/auth.controller.js';
import { mailController } from './modules/mail/mail.controller.js';
import { profileController } from './modules/profile/profile.controller.js';

export const routes: { [route: string]: Router } = {
    "/auth": authController,
    "/profile": profileController,
	"/mail": mailController
}