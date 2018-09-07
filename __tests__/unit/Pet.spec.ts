
import { getManager, Repository  }   from "typeorm";

import * as db from "../lib/db";
import sample from "../lib/sample";
import { User } from "../../entity/User";
import { Pet } from "../../entity/Pet";

  beforeAll(async () => {
    await db.initDB();
  });

  afterAll(async () => {
    await db.closeDB();
  })

describe("#Pet Model", () => {

  let createdPet: Pet;
  let createdUser: User;

  test("Add a pet record", async () => {
    const UserRepo: Repository<User> = getManager().getRepository(User);
    const PetRepo: Repository<Pet> = getManager().getRepository(Pet);

    let user = UserRepo.create(sample.user);
    createdUser = await UserRepo.save(user);

    sample.pet.added_by = user;

    let pet = PetRepo.create(sample.pet);
    createdPet = await PetRepo.save(pet);

    expect(createdPet).not.toBeNull();
    expect(createdPet.RFID).toEqual(sample.pet.RFID);
  })

  test("Retrieve pet record", async () => {
    const PetRepo: Repository<Pet> = getManager().getRepository(Pet);

    let pet: any = await PetRepo.findOne(createdPet.id);

    expect(pet).not.toBeNull();
    expect(pet.RFID).toEqual(sample.pet.RFID);
  })
})

