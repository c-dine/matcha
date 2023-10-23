import {socketRC} from '../socketBase.controller.js';

const activityController = socketRC('/activity');

activityController.event('sendMessage', (message) => console.log(message));

export default activityController;