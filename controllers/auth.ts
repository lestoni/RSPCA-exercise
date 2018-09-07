/**
 * Load Module Dependencies
 */
import * as crypto from "crypto";

import { getManager, Repository, Not, Equal } from "typeorm";
import { validate, ValidationError, IsEmail, IsNotEmpty }  from "class-validator";
import { Context } from "koa";
import * as bcrypt  from "bcrypt";

import { User }     from "../entity/User";
import { AuthToken } from "../entity/AuthToken";


export default class AuthController {

  public static async loginUser(ctx: Context) {

    try {
      const body: any = ctx.request.body;

      class AuthUser {
        @IsEmail()
        @IsNotEmpty()
        email!: string;

        @IsNotEmpty()
        password!: string;
      }

      // Get User/AuthToken Repo
      const UserRepo: Repository<User> = getManager().getRepository(User);
      const AuthTokenRepo: Repository<AuthToken> = getManager().getRepository(AuthToken);

      let authUser = new AuthUser();
      authUser.email = body.email;
      authUser.password = body.password;

      // validate user auth info
      let errors: ValidationError[] = await validate(authUser);

      // If Validation Errors Respond Immediately
      if(errors.length) {
        throw new Error(JSON.stringify(errors))
      }

      // Verify Email address
      let user: any = await UserRepo.findOne({ email: body.email });
      if(!user) {
        throw new Error("User With Those Credentials Does Not Exist")
      }

      // Verify Password
      let isPasswordOk = await bcrypt.compare(body.password, user.password);
      if(!isPasswordOk) {
        throw new Error("User With Those Credentials Does Not Exist")
      }

      // Upsert User Auth Token
      let userToken = await AuthTokenRepo.findOne({ user: user.id });
      let apiKey = crypto.randomBytes(23).toString("base64");
      if(userToken) {
        await AuthTokenRepo.update(user.id, { token: apiKey });
      } else {
        await AuthTokenRepo.insert({
          user: user.id,
          token: apiKey
        });
      }

      delete user.password;

      ctx.body = {
        token: apiKey,
        user: user
      };

    } catch(ex) {
      ctx.throw(ex)
    }
  }

  public static async logoutUser(ctx: Context) {

    const SessionUser = ctx.state.user;

    if(!SessionUser) {
      ctx.status = 400;
      ctx.body = {
        message: "You Must Be Logged In First!"
      };
    }

    // Get AuthToken Repo
    const AuthTokenRepo: Repository<AuthToken> = getManager().getRepository(AuthToken);

    const NullifiedAPIKey = crypto.randomBytes(11).toString("hex");

    await AuthTokenRepo.update(SessionUser.id, { token: NullifiedAPIKey })

    ctx.status = 200;
    ctx.body = {
      message: "Success"
    }

  }
}