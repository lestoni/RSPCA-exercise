/**
 * Load Module Dependencies
 */
import * as crypto from "crypto";

import { getManager, Repository, Not, Equal } from "typeorm";
import { validate, ValidationError }  from "class-validator";
import { Context } from "koa";
import * as bcrypt  from "bcrypt";

import { User }     from "../entity/User";
import { AuthToken } from "../entity/AuthToken";


export default class AuthController {

  public static async loginUser(ctx: Context) {

    const body = ctx.body;

    class AuthUser {
      @Length(10, 100)
      @IsEmail()
      email: string;

      @Length(10, 100)
      password: string;
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
      ctx.status = 400;
      ctx.body = errors;
    }

    // Verify Email address
    let user = await UserRepo.findOne({ email: body.email });
    if(!user) {
      ctx.status = 400;
      ctx.body = { message: "User With Those Credentials Does Not Exist";
    }

    // Verijfy Password
    let isPasswordOk = await bcrypt.compare(body.password, user.password);
    if(!isPasswordOk) {
      ctx.status = 400;
      ctx.body = { message: "User With Those Credentials Does Not Exist";
    }

    // Upsert User Auth Token
    let userToken = await AuthTokenRepo.findOne({ user_id: user.id });
    let apiKey = crypto.randomBytes(11).toString("hex");
    if(userToken) {
      await AuthTokenRepo.update(user.id, { token: apiKey });
    } else {
      await AuthTokenRepo.insert({
        user_id; user.id,
        token: apiKey
      });
    }

    ctx.status = 201;
    ctx.body = {
      token: apiKey,
      user: user
    };

  }

  public static async logoutUser(ctx: Context) {

    const SessionUser = ctx.state._user;

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