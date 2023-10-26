import { socketRC } from "./socket-rc/socketNamespace.js";
import { routes } from "./routes/routes.js";

const socket = socketRC();

socket.useRoutes(routes);

socket.listen(3002);