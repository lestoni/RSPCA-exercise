/**
 * Load Module Dependencies
 */
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { Length, IsDate, IsInt } from "class-validator";

// Define Pet Model

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    unique: true
  })
  RFID: string;

  @Column()
  species: string;

  @Column()
  breed: string;

  @Column()
  height_at_withers: number;

  @Column()
  @IsInt()
  weight: number;

  @Column()
  description: number;

  @Column()
  @IsDate()
  date_of_arrival: Date;
}