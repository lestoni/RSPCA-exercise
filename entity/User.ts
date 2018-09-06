/**
 * Load Module Dependencies
 */
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from "typeorm";
import { IsEmail, Length, IsNotEmpty, IsString, MinLength } from "class-validator";
import bcrypt from "bcrypt";

import { config } from "../config";

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

  @BeforeInsert()
  hashPassword() {
    // hash password
    let hash = bcrypt.hashSync(this.password, config.SALT_FACTOR);
    this.password = hash;
  }
}