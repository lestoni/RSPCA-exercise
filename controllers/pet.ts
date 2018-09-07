/**
 * Load Module Dependencies
 */
import { getManager, Repository  }   from "typeorm";
import { validate, ValidationError, Validator }           from "class-validator";
import { Context }                             from "koa";

import { Pet } from "../entity/Pet";
import { User } from "../entity/User";


interface IPagination {
  docs?: Array<any>;
  total_docs?: number;
  total_pages?: number;
  current_page: number;
  per_page: number;
}


export default class PetController {

  public static async addPet(ctx: Context) {

    try {
      let body: any = ctx.request.body;
      const SessionUser = ctx.state.user;

      // Get Pet Repo
      const PetRepo: Repository<Pet> = getManager().getRepository(Pet);
      const UserRepo: Repository<User> = getManager().getRepository(User);

       const addedBy = await UserRepo.findOne(SessionUser.id);
       body.added_by = SessionUser;

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
      const SessionUser = ctx.state.user;
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
      const SessionUser     = ctx.state.user;
      const params          = ctx.params;
      const qs              = ctx.query;

      let res: IPagination = {
        current_page: qs.page || 1,
        per_page: qs.limit || 100,

      };

      let validator = new Validator();

      // Get Pet Repo
      const PetRepo: Repository<Pet> = getManager().getRepository(Pet);

      let query = {};

      if(qs.added_by) {
        query = { added_by: qs.added_by };
      }


      let petsCount = await PetRepo.count(query);

      let pageCount =  Math.ceil(petsCount / res.per_page);

      let pets =  await PetRepo.find({
        where: query,
        skip: res.current_page,
        take: res.per_page,
        order: { created_at: "DESC"}
      });

      res.docs = pets;
      res.total_docs = petsCount;
      res.total_pages = pageCount;

      ctx.body = res;

    } catch(ex) {
      ctx.throw(ex);
    }

  }
}