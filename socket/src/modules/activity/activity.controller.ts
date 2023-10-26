import {socketRC} from '../../socket-rc/socketNamespace.js';

const activityController = socketRC();

activityController.event('new message', (message) => {
	console.log(message, ' ', activityController.namespace)
});

activityController.event('typing', (message) => {
	console.log(message, ' ', activityController.namespace)
});

activityController.event('stop typing', (message) => {
	console.log(message, ' ', activityController.namespace)
});


export default activityController;