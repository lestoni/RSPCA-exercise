/**
 * Load Module Dependencies
 */
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from "typeorm";
import { IsEmail, Length } from "class-validator";
import * as bcrypt from "bcrypt";

import { config } from "../config";

// Define User Model

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    length: 100
  })
  full_name: string;

  @Column({
    length: 100
  })
  @BeforeInsert()
  hashPassword() {
    // hash password
    let hash = bcrypt.hashSync(this.password, config.SALT_FACTOR);
    this.password = hash;
  }
  password: string;

  @Column({
    length: 100,
    unique: true
  })
  @Length(10, 100)
  @IsEmail()
  email: string;
}