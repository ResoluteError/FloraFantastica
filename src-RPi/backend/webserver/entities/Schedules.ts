import { PrimaryGeneratedColumn, Column, Entity, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Schedule {
 
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: "text", unique: true})
  plantId: string; // only one schedule per plant

  @Column("boolean")
  active: boolean;

  @Column("blob")
  rule: string;

  @Column("blob")
  action: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

}