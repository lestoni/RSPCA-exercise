/**
 * Load Module Dependencies
 */
import * as Router from "koa-router";

import * as userRouter from "./user";
import * as petRouter from "./pet";

const appRouter = new Router();

appRouter.use(`/api/users`, userRouter.routes(), userRouter.allowedMethods());

appRouter.use(`/api/pets`, petRouter.routes(), petRouter.allowedMethods());

// Export App Router
export default appRouter;
