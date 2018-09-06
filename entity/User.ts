/**
 * Load Module Dependencies
 */
import {
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  BeforeInsert, 
  OneToMany 
} from "typeorm";
import { 
  IsEmail, 
  Length, 
  IsNotEmpty, 
  IsString, 
  MinLength 
} from "class-validator";
import bcrypt from "bcrypt";

import { config } from "../config";
import { Pet } from "../entity/Pet";

// Define User Model

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  full_name!: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  password!: string;

  @Column({
    unique: true
  })
  @Length(10, 100)
  @IsEmail()
  email!: string;

  // Associate Staff User With A Pet
  @OneToMany(type => Pet, pet => pet.added_by)
  pets!: Pet[];

  // Listeners
  @BeforeInsert()
  hashPassword() {
    // hash password
    let hash = bcrypt.hashSync(this.password, config.SALT_FACTOR);
    this.password = hash;
  }
}