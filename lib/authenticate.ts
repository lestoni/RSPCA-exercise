/**
 * Load Module Dependencies
 *
 */

import Debug from "debug";
import { getManager, Repository }   from "typeorm";
import { Context, Middleware } from "koa";
import convert from "koa-convert";

import { config } from "../config";
import { CustomError } from "../lib/errors";
import { AuthToken } from "../entity/AuthToken";
import { User } from "../entity/User";

const debug = Debug("api:session-authentication");

export default function authenticateUser() {
  return async (ctx: Context, next: Function) => {
    debug(`handling request for ${ctx.url}`);

    // Skip Open Endpoints
    let skipEndpoint = config.OPEN_ENDPOINTS.some((endpoint: string): boolean => {
      return endpoint === ctx.url;
    });

    try {
      if(skipEndpoint) {
        await next();

      } else {
        let accessToken: any;
        let headers = ctx.headers;

        if (headers && headers.authorization) {
          let parts = headers.authorization.split(' ');

          if (parts.length === 2) {
            let scheme = parts[0];
            let credentials = parts[1];

            if (/^Bearer$/i.test(scheme)) {
              accessToken = credentials;

            } else {
              throw new Error("Format is Authorization: Bearer [token]")

            }
          } else {
            throw new Error("Format is Authorization: Bearer [token]")
          }

        }

        if (!accessToken) {
          throw new Error("No authorization token was found")
        }

        // Get User/AuthToken Repo
        const UserRepo: Repository<User> = getManager().getRepository(User);
        const AuthTokenRepo: Repository<AuthToken> = getManager().getRepository(AuthToken);

        let token = await AuthTokenRepo.findOne({ token: accessToken });

        if(!token) {
          throw new Error("Access Token provided is invalid")
        }
        

        let stateUser = await UserRepo.findOne(token.user.id);

        ctx.state.user = stateUser;

        await next();
      }


    } catch(ex) {
      ctx.throw({
        message: ex.message
      })
    }

  };
}