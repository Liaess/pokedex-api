import { Entity, PrimaryGeneratedColumn, Column, ManyToOne,  } from "typeorm";

@Entity("pokemon_user")
export default class Pokemon_User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pokemonId: number;

  @Column()
  usersId: number;

}
