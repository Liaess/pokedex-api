import { getRepository } from "typeorm";
import Pokemon from "../entities/PokemonEntity";
import User from "../entities/UserEntity";

export async function getAllPokemonsFromUser(id:number) {
    const result = await getRepository(User).findOne(id,{
        relations: ["pokemon"],
    });
    return result
}

export async function getAllPokemons() {
    return await getRepository(Pokemon).find({
        order: {
            id: "ASC"
        }
    });;
}