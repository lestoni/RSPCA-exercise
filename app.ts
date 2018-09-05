'use strict';

/**
 * Load Module Dependencies
 */
import * as path from "path";

import * as Koa from "koa";
import * as serve from "koa-static"
import * as logger from "koa-logger";
import * as bodyParser from "koa-body";

import { appErrorHandler } from "./lib/errors";
import * as router  from "./routes";

let app = new Koa();

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
app.use(serve(path.join(__dirname, '/docs')));

// Enable Body parser
app.use(bodyParser());

//--Routes--//
app.use(router.routes());

// Export app for testing
export default app;