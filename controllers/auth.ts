/**
 * Load Module Dependencies
 */
import { getManager, Repository, Not, Equal }   from "typeorm";
import { validate, ValidationError }           from "class-validator";
import { Context }                             from "koa";

import { User } from "../entity/User";


export default class AuthController {

  public static async createUser(ctx: Context) {

    // Get User Repo
    const UserRepo: Repository<User> = getManager().getRepository(User);

    // Construct User to Be Saved
    let user = UserRepo.create(ctx.body);

    // validate User Entity Data
    let errors: ValidationError[] = await validate(user);

    // If Validation Errors Response Immediately
    if(errors.length) {
      ctx.status = 400;
      ctx.body = errors;
    }

    // Check if User Already Exists
    let userExists = await UserRepo.findOne({ email: body.email });
    if(userExists) {
      ctx.status = 400;
      ctx.body = { message: "User Exists Already";
    }

    // Finally Save User
    user = await UserRepo.save(user);

    ctx.status = 201;
    ctx.body = user;

  }
}