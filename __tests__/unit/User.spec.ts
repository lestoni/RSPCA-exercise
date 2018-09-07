
import { getManager, Repository  }   from "typeorm";

import * as db from "../lib/db";
import sample from "../lib/sample";
import { User } from "../../entity/User";

  beforeAll(async () => {
    await db.initDB();
  });

  afterAll(async () => {
    await db.closeDB();
  })

describe("#User Model", () => {

  let createdUser: User;

  test("Add user record", async () => {
    const UserRepo: Repository<User> = getManager().getRepository(User);

    let user = UserRepo.create(sample.user);

    createdUser = await UserRepo.save(user);

    expect(createdUser).not.toBeNull();
    expect(createdUser.email).toEqual(sample.user.email);
  })

  test("Retrieve user record", async () => {
    const UserRepo: Repository<User> = getManager().getRepository(User);

    let user: any = await UserRepo.findOne(createdUser.id);

    expect(user).not.toBeNull();
    expect(user.email).toEqual(sample.user.email);
  })
})

