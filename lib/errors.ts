/**
 * Load Module Dependencies
 */
import { Context } from "koa";

const DEFAULT_ERROR = {
  status: 500,
  message: 'Unknown issue',
  user_message: "Oh! Snap! Something Just Broke! Hold on, our benevolent team is checking it out!",
  type: "SERVER_ERROR"
}

/**
 * CustomError Type Definition
 */

class CustomError extends Error {

  type: string;
  status: string;
  user_message: string;
  validation_errors: any;

  constructor(info: any = {}) {
    super(info.message ? info.message : DEFAULT_ERROR.message);

    this.type               = info.type ? info.type : DEFAULT_ERROR.type;
    this.status             = info.status ? info.status : DEFAULT_ERROR.status;
    this.user_message       = info.user_message ? info.user_message : DEFAULT_ERROR.user_message;
    this.validation_errors  = info.validation_errors ? info.validation_errors : [];

  }
}

function appErrorHandler() {
  return async (ctx: Context, next: Function) => {
    try {
      await next();

    } catch (err) {
      let ex = {
        status: err.status,
        user_message: err.user_message,
        message: err.message,
        validation_errors: err.validation_errors,
        type: err.type
      };

      ctx.status = ex.status;
      ctx.body = ex;
      
      ctx.app.emit('error', err, ctx);
    }
  };
};


export { CustomError, appErrorHandler }