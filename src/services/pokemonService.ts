import { getRepository } from "typeorm";
import Pokemon from "../entities/PokemonEntity";
import Pokemon_User from "../entities/Pokemon_UserEntity";
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

export async function addToList(usersId: number, pokemonId: number){
    const userPokemons = await getRepository(Pokemon_User).find({ 
        where: {
            pokemonId,
            usersId,
        }
    });
    const exists = userPokemons.find(item => item.pokemonId === pokemonId);
    if (exists) return null;
    await getRepository(Pokemon_User).insert({
        pokemonId,
        usersId,
    });
    return true;
};

export async function removeFromList(usersId: number, pokemonId: number){
    const userPokemons = await getRepository(Pokemon_User).find({ 
        where: {
            pokemonId,
            usersId,
        }
    });

    const exists = userPokemons.find(item => item.pokemonId === pokemonId);
    if (!exists) return null;
    await getRepository(Pokemon_User).delete({pokemonId,usersId})
    return true;
};