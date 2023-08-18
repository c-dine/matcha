import { routes } from "./routes.js";
import express from 'express';
import * as dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { connectToDatabase, disconnectFromDatabase } from "./middlewares/database.middleware.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import { authenticationHandler } from "./middlewares/authentication.middleware.js";

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(connectToDatabase);

for (const route in routes) app.use(route, routes[route]);

app.use(errorHandler);
app.use(disconnectFromDatabase);

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
