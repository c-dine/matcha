import {socketRC} from '../../socket-rc/socketNamespace.js';

const connectionController = socketRC();

connectionController.event('is connected', (arg) => {
	try {
		connectionController.emitIsConnected('is connected', arg);
	}
	catch (e){}
});

export default connectionController;