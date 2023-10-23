import { socketRC } from "./modules/socketBase.controller.js";
import { controllers } from "./modules/controller.module.js";

const socket = socketRC();

for (const controller of controllers) socket.use(controller);

socket.listen(3002);