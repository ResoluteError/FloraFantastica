import { PrimaryGeneratedColumn, Column, Entity } from "typeorm";

@Entity()
export class Measurement {

  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  sensorId: string; 

  // See entity/Sensors.ts
  @Column('integer')
  sensorType: number;

  @Column('text')
  plantId: string;

  @Column('datetime')
  measuredAt: string;

  @Column("double")
  data: number; 
  
}