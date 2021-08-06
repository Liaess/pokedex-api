import "./setup";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import "reflect-metadata";
import connectDatabase from "./database";
import * as userController from "./controllers/userController";
import * as pokemonController from "./controllers/pokemonController"
import { authMiddleware } from "./middlewares/authMiddleware";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/sign-up", userController.signUp);
app.post("/sign-in", userController.signIn);
app.post("/populate",pokemonController.populatePokemons);
app.get("/pokemons", authMiddleware, pokemonController.getAllPokemons);
app.post("/my-pokemons/:id/add", authMiddleware, pokemonController.addPokemon)
app.post("/my-pokemons/:id/remove", authMiddleware, pokemonController.removePokemon)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  return res.sendStatus(500);
});

export async function init () {
  await connectDatabase();
}

export default app;
