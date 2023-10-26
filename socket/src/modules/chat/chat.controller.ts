import {socketRC} from '../../socket-rc/socketNamespace.js';

const chatController = socketRC();

chatController.event('sendMessage', (message) => console.log(message, chatController.namespace));

export default chatController;