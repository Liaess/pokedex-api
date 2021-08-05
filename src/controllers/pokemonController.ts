import { Request, Response } from "express";
import axios from "axios";
import Pokemon from "../entities/Pokemons";
import { getRepository } from "typeorm";


export async function populatePokemons(req: Request, res: Response){
    for(let i = 1; i < 152; i ++){
        const result = await axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`)
        const newPokemon = {
            name: result.data.name,
            number: result.data.id,
            image: result.data.sprites.front_default,
            weight: result.data.weight,
            height: result.data.height,
            baseExp: result.data.base_experience,
            description: ""
        }
        const speciesResult = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${i}`)
        for (let j = 0; j < speciesResult.data.flavor_text_entries.length; j++) {
            if(speciesResult.data.flavor_text_entries[j].language.name === "en"){
            newPokemon.description =  speciesResult.data.flavor_text_entries[j].flavor_text.split("\n").join(" ")
            }
        }
        await getRepository(Pokemon).insert(newPokemon);
    }
}

export async function getAllPokemons(req: Request, res: Response) {
    
}