/**
 * Load Module Dependencies
 */
import Router from "koa-router";

import userRouter from "./user";
import  petRouter from "./pet";

const appRouter = new Router();

appRouter.use(`/users`, userRouter.routes(), userRouter.allowedMethods());

appRouter.use(`/pets`, petRouter.routes(), petRouter.allowedMethods());

// Export App Router
export default appRouter;
