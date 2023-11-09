import { Router } from 'express';
import { authController } from './modules/auth/auth.controller.js';
import { mailController } from './modules/mail/mail.controller.js';
import { userController } from './modules/user/user.controller.js';
import { tagController } from './modules/tag/tag.controller.js';
import { pictureController } from './modules/picture/picture.controller.js';
import { blacklistController } from './modules/interactions/blacklist/blacklist.controller.js';
import { fakeReportController } from './modules/interactions/fake-report/fake-report.controller.js';
import { chatController } from './modules/chat/chat.controller.js';
import { viewController } from './modules/interactions/view/view.controller.js';
import { likeController } from './modules/interactions/like/like.controller.js';
import { notificationController } from './modules/notification/notification.controller.js';

export const routes: { [route: string]: Router } = {
    "/auth": authController,
    "/user": userController,
	"/mail": mailController,
	"/picture": pictureController,
	"/tag": tagController,
	"/blacklist": blacklistController,
	"/fakeReport": fakeReportController,
	"/chat": chatController,
	"/like": likeController,
	"/view": viewController,
	"/notification": notificationController,
}