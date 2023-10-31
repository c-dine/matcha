import {socketRC} from '../../socket-rc/socketNamespace.js';

const chatController = socketRC();

chatController.event('new message', (arg) => {
	try {
		chatController.emitTo('new message', arg);
	}
	catch (e){
		console.log(e.message);
	}
});

chatController.event('typing', (arg) => {
	try {
		console.log('typing')
		chatController.emitTo('typing', arg);
	}
	catch (e){
		console.log(e.message);
	}
});

chatController.event('stop typing', (arg) => {
	try {
		chatController.emitTo('stop typing', arg);
	}
	catch (e){
		console.log(e.message);
	}
});

export default chatController;