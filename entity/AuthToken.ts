/**
 * Load Module Dependencies
 */
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from "typeorm";
import { IsEmail, Length } from "class-validator";

// Define Auth Token Model

@Entity()
export class AuthToken {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    length: 100
  })
  user_id!: string;

  @Column({
    length: 100,
    unique: true
  })
  token!: string;
}