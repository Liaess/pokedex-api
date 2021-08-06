import { Request, Response } from "express";
import axios from "axios";
import Pokemon from "../entities/PokemonEntity";
import { getRepository } from "typeorm";
import * as pokemonService from "../services/pokemonService"
import { idSchema } from "../schemas/userSchemas";

export async function populatePokemons(req: Request, res: Response){
    const {password} = req.body as {password: string};
    if(password !== process.env.SECRET) return
    for(let i = 1; i < 899; i ++){
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
                newPokemon.description =  speciesResult.data.flavor_text_entries[j].flavor_text.split("\n").join(" ");
            }
        }
        await getRepository(Pokemon).insert(newPokemon);
    }
    res.sendStatus(200);
}



export async function getAllPokemons(req: Request, res: Response) {
    const user = res.locals.user
    const allPokemons = await pokemonService.getAllPokemons();
    const userPokemons:any = await pokemonService.getAllPokemonsFromUser(user.id);
    for (let i = 0; i < userPokemons.pokemon.length; i++) {
        const pokemon = userPokemons.pokemon[i];
        let left = 0;
        let right = allPokemons.length - 1;
        while(left <= right){
            const middle = Math.floor((left + right) / 2);
            const item = allPokemons[middle];
            if(item.id === pokemon.id){
                item.inMyPokemon = true;
                break
            }else if(pokemon.id < item.id){
                right = middle -1;
            }else{
                left = middle + 1;
            }
        }
    }
    res.send(allPokemons)
}

export async function addPokemon(req: Request, res: Response) {
    const id:number = Number(req.params.id);
    const user = res.locals.user;
    const value = idSchema.validate({id:id});
    if(value.error) return res.sendStatus(400);
    const findPokemon = await pokemonService.addToList(user.id, id);
    if (findPokemon === null) return res.sendStatus(401);
    res.sendStatus(200);
}

export async function removePokemon(req: Request, res: Response) {
    const id:number = Number(req.params.id);
    const user = res.locals.user;
    const value = idSchema.validate({id:id});
    if(value.error) return res.sendStatus(400);
    const findPokemon = await pokemonService.removeFromList(user.id, id);
    if (findPokemon === null) return res.sendStatus(401);
    res.sendStatus(200);
}