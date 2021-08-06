import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import User from "./UserEntity";

@Entity("pokemon")
export default class Pokemon{
    @PrimaryGeneratedColumn()
    id: number;
 
    @Column()
    name: string;
 
    @Column()
    number: number;
 
    @Column()
    image: string;
 
    @Column()
    weight: number;
 
    @Column()
    height: number;
 
    @Column()
    baseExp: number;
 
    @Column()
    description: string;

    @Column()
    inMyPokemon: boolean;

    @ManyToMany(()=> User, user => user.pokemon)
    @JoinTable({name: "pokemon_user"})
    user: User[] 
}