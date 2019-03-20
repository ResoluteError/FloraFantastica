import { PrimaryGeneratedColumn, Column, Entity } from "typeorm";

@Entity()
export class Sensor {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: "text", nullable: true})
  currentPlantId: string;

  @Column("text")
  name: string;

  @Column({type: "text", nullable: true})
  pin: string;

  // 10 - air humidity; 11 - air temp; 
  // 20 - soil moisture; 21 - soil temp; 
  // 30 - ground light;
  // 40 - watering button; 
  @Column("int")
  type: number; 

  @Column("int")
  state: number; // 0 - unreachable; 1 - paused; 2 - observing;




}