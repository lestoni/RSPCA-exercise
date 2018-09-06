/**
 * Load Module Dependencies
 */
import { getManager, Repository, Not, Equal }   from "typeorm";
import { validate, ValidationError, Validator }           from "class-validator";
import { Context }                             from "koa";

import { Pet } from "../entity/Pet";


export default class PetController {

  public static async addPet(ctx: Context) {

    try {
      let body: any = ctx.request.body;
      const SessionUser = ctx.state.user;

      body.added_by = SessionUser;

      console.log(body)

      // Get Pet Repo
      const PetRepo: Repository<Pet> = getManager().getRepository(Pet);

      // Construct Pet to Be Saved
      let pet = PetRepo.create(body);

      // validate Pet Entity Data
      let errors: ValidationError[] = await validate(pet);

      // If Validation Errors Response Immediately
      if(errors.length > 0) {
        throw new Error(JSON.stringify(errors))
      }

      // Check if Pet Already Exists
      let petExists = await PetRepo.findOne({ RFID: body.RFID });
      if(petExists) {
        throw new Error("Pet Exists Already")
      }

      // Finally Save Pet
      pet = await PetRepo.save(pet);

      ctx.status = 201;
      ctx.body = pet;

    } catch(ex) {
      ctx.throw(ex);
    }

  }

  public static async getPet(ctx: Context) {

    try {
      let body: any = ctx.request.body;
      const SessionUser = ctx.state._user;
      const params = ctx.params;

      let validator = new Validator();

      // Get Pet Repo
      const PetRepo: Repository<Pet> = getManager().getRepository(Pet);

      let query = {};

       if(validator.isUUID(params.id)) {
        query = { id: params.id };
       } else {
        query = { RFID: params.id };
       }

      let pet =  await PetRepo.findOne(query);

      ctx.body = pet;

    } catch(ex) {
      ctx.throw(ex);
    }

  }

  public static async getPets(ctx: Context) {

    try {
      const body: any       = ctx.request.body;
      const SessionUser   = ctx.state._user;
      const params        = ctx.params;
      const qs = ctx.query;

      let validator = new Validator();

      // Get Pet Repo
      const PetRepo: Repository<Pet> = getManager().getRepository(Pet);

      let query = {};

      if(qs.added_by) {
        query = { added_by: qs.added_by };
      }

      let pets =  await PetRepo.find(query);

      ctx.body = pets;

    } catch(ex) {
      ctx.throw(ex);
    }

  }
}