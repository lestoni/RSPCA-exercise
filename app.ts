/**
 * Load Module Dependencies
 */
import * as path from "path";

import Koa from "koa";
import serve from "koa-static"
import logger from "koa-logger";
import bodyParser from "koa-bodyparser";

import { appErrorHandler } from "./lib/errors";
import router  from "./routes";

const app = new Koa();

/**
 * Application Settings
 */

/**
 * Setup Middleware.
 */

// Set Error Handler
app.use(appErrorHandler());

// Enable Console logging(only in development)
if(app.env === 'development') {
  app.use(logger());
}

// Serve Documentation files
app.use(serve(path.join(__dirname, './docs')));

// Enable Body parser
app.use(bodyParser());

//--Routes--//
app.use(router.routes());

// Export app for testing
export default app;