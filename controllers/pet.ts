/**
 * Load Module Dependencies
 */
import { getManager, Repository, Not, Equal }   from "typeorm";
import { validate, ValidationError }           from "class-validator";
import { Context }                             from "koa";

import { Pet } from "../entity/Pet";


export default class PetController {

  public static async createPet(ctx: Context) {

    // Get Pet Repo
    const PetRepo: Repository<Pet> = getManager().getRepository(Pet);

    // Construct Pet to Be Saved
    let pet = PetRepo.create(ctx.body);

    // validate Pet Entity Data
    let errors: ValidationError[] = await validate(pet);

    // If Validation Errors Response Immediately
    if(errors.length) {
      ctx.status = 400;
      ctx.body = errors;
    }

    // Check if Pet Already Exists
    let petExists = await PetRepo.findOne({ RFID: body.RFID });
    if(petExists) {
      ctx.status = 400;
      ctx.body = { message: "Pet Exists Already";
    }

    // Finally Save Pet
    pet = await PetRepo.save(pet);

    ctx.status = 201;
    ctx.body = pet;

  }
}