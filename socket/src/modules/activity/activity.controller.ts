import {socketRC} from '../../socket-rc/socketNamespace.js';

const activityController = socketRC();

activityController.event('new activity', (arg) => {
	try {
		activityController.emitTo('new activity', arg);
	}
	catch (e){
		console.log(e.message);
	}
});

export default activityController;