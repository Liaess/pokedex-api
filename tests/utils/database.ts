import { getRepository } from "typeorm";
import User from "../../src/entities/UserEntity";
import Session from "../../src/entities/SessionEntity";
import Pokemon_User from "../../src/entities/Pokemon_UserEntity";

export async function clearDatabase () {
  await getRepository(Session).delete({});
  await getRepository(Pokemon_User).delete({});
  await getRepository(User).delete({});
}
