import { PrimaryGeneratedColumn, Column, Entity } from "typeorm";

@Entity()
export class Plant {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text")
  name : string;

  @Column("blob")
  icon : string;

  @Column("int")
  state: number; // 0 - undefined; 1 - paused; 2 - observing; 3 - watering;

  @Column("text")
  currentData: string;

}