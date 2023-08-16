import { Router } from 'express';
import { authController } from './modules/auth/auth.controller.js';
import { mailController } from './modules/mail/mail.controller.js';

export const routes: { [route: string]: Router } = {
    "/auth": authController,
	"/mail": mailController
}