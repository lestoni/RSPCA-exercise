/**
 * Load Module Dependencies
 */
import { getManager, Repository  }   from "typeorm";
import { validate, ValidationError }           from "class-validator";
import { Context }                             from "koa";

import { User } from "../entity/User";


export default class UserController {

  public static async createUser(ctx: Context) {

    try {
      const body: any = ctx.request.body;

      // Get User Repo
      const UserRepo: Repository<User> = getManager().getRepository(User);

      // Construct User to Be Saved
      let user = UserRepo.create(body);

      // validate User Entity Data
      let errors: ValidationError[] = await validate(user);

      // If Validation Errors Response Immediately
      if(errors.length > 0) {
        throw new Error(JSON.stringify(errors))
      }

      // Check if User Already Exists
      let userExists = await UserRepo.findOne({ email: body.email });
      if(userExists) {
        throw new Error("User Exists Already")
      }

      // Finally Save User
      user = await UserRepo.save(user);

      ctx.status = 201;
      ctx.body = user;

    } catch(ex) {
      ctx.throw(ex);
    }

  }
}