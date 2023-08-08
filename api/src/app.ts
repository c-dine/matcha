import { routes } from "./routes.js";
import express from 'express';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();

for (const route in routes) app.use(route, routes[route]);

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
