/**
 * Load Module Dependencies
 */
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Length, IsDate, IsInt, IsISO8601 } from "class-validator";

import { User } from "../entity/User";

// Define Pet Model

@Entity()
export class Pet {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    unique: true
  })
  RFID!: string;

  @Column()
  species!: string;

  @Column()
  breed!: string;

  @Column()
  height_at_withers!: number;

  @Column()
  @IsInt()
  weight!: number;

  @Column()
  description!: number;

  @Column()
  @IsISO8601()
  date_of_arrival!: Date;

  // Associate Staff User With A Pet
  @ManyToOne(type => User, user => user.pets, {
    eager: true
  })
  added_by!: User;
}