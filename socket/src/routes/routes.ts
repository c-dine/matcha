import chatController from '../modules/chat/chat.controller.js';
import activityController from '../modules/activity/activity.controller.js';
import { SocketRoutes } from '../socket-rc/sockerRouter.js';

export const routes: SocketRoutes[] = [
	{route: '/chat', socketNamespace: chatController},
	{route: '/activity', socketNamespace: activityController},
];