import { Entity, PrimaryGeneratedColumn, Column, ManyToOne,  } from "typeorm";
import User from "./UserEntity";

@Entity("session")
export default class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column()
  usersId: number;
  
  @ManyToOne(()=> User)
  users: User;
}
