import chatController from '../modules/chat/chat.controller.js';
import activityController from '../modules/activity/activity.controller.js';
import { SocketRoutes } from '../socket-rc/socketRouter.js';
import connectionController from '../modules/connection/connection.controller.js';

export const routes: SocketRoutes[] = [
	{route: '/chat', socketNamespace: chatController},
	{route: '/activity', socketNamespace: activityController},
	{route: '/connection', socketNamespace: connectionController},
];