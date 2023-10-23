import {socketRC} from '../socketBase.controller.js';

const chatController = socketRC('/chat');

chatController.event('sendMessage', (message) => console.log(message));

export default chatController;