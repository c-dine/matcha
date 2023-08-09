import { routes } from "./routes.js";
import express from 'express';
import * as dotenv from 'dotenv';
import { connectToDatabase, disconnectFromDatabase } from "./middlewares/database.middleware.js";

dotenv.config();

const app = express();

app.use(connectToDatabase);

for (const route in routes) app.use(route, routes[route]);

app.use(disconnectFromDatabase);

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
