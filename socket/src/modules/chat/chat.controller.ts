import {socketRC} from '../../socket-rc/socketNamespace.js';

const chatController = socketRC();

chatController.event('new message', (arg) => {
	try {
		chatController.emitTo('new message', arg);
	}
	catch (e){}
});

chatController.event('typing', (arg) => {
	try {
		chatController.emitTo('typing', arg);
	}
	catch (e){}
});

chatController.event('stop typing', (arg) => {
	try {
		chatController.emitTo('stop typing', arg);
	}
	catch (e){}
});

export default chatController;