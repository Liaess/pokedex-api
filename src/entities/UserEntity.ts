import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import Pokemon from "./PokemonEntity";

@Entity("users")
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @ManyToMany(()=> Pokemon, pokemon => pokemon.user)
  @JoinTable({name: "pokemon_user"})
  pokemon: Pokemon[] 
}
