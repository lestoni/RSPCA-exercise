/**
 * Load Module Dependencies
 *
 */

import * as Debug from "debug";
import * as unless from "koa-unless";
import { getManager, Repository }   from "typeorm";
import { Context }                             from "koa";

import { config } from "../config";
import { CustomError } from "../lib/errors";
import { AuthToken } from "../entity/AuthToken";
import { User } from "../entity/User";

const debug = Debug("api:session-authentication")

export default function authenticateUser() {
  return async (ctx: Context, next: Function) => {
    debug(`handling request for ${ctx.url}`);

    try {
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

      let user = await UserRepo.findOne({ id: token.user_id })

      ctx.state._user = user;

      await next;
    } catch(ex) {
      ctx.throw({
        message: ex.message
      })
    }

  }
}