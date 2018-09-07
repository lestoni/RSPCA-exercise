/**
 * Load Module Dependencies
 */
import {
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  BeforeInsert, 
  OneToOne, 
  JoinColumn ,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
import { IsEmail, Length } from "class-validator";

import { User } from "../entity/User";

// Define Auth Token Model

@Entity()
export class AuthToken {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    length: 100,
    unique: true
  })
  token!: string;

  @OneToOne(type => User, {
    eager: true
  })
  @JoinColumn()
  user!: User;

  @CreateDateColumn({type: "date"})
  created_at!: Date;

  @UpdateDateColumn({type: "date"})
  updated_at!: Date;
}