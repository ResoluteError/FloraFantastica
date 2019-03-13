import { PrimaryGeneratedColumn, Column, Entity } from "typeorm";

@Entity()
export class SensorMeasurement {

  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  sensorId: string; 

  @Column('text')
  plantId: string;

  @Column('datetime')
  measuredAt: Date;

  @Column("double")
  data: number; 
  
}