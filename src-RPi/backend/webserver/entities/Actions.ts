import { PrimaryGeneratedColumn, Column, Entity, CreateDateColumn } from "typeorm";

@Entity()
export class Action {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("int")
  actionType: number;

  @Column("int")
  actionPin: number;

  @Column("int")
  activationType: number;

  @Column("text")
  plantId: string;

  @Column({type: "double", nullable: true})
  duration?: number;

  @Column({type: "int", default: 0})
  state: number; // 0 = queued, 1 = completed, -1 = error

  @CreateDateColumn()
  createdAt: string;

}