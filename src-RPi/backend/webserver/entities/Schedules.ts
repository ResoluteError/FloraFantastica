import { PrimaryGeneratedColumn, Column, Entity, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Schedule {
 
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: "text", unique: true})
  plantId: string; // only one schedule per plant

  @Column("boolean")
  active: boolean;

  @Column({type: "int", nullable: true})
  minDurationSinceWatering?: number;

  @Column({type: "int", nullable: true})
  minSoilDryness?: number;

  @Column({type: "int", nullable: true})
  maxLight?: number;

  @Column("int")
  valvePin: number;
  
  @Column("int")
  duration: number;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

}