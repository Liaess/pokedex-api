import { getRepository } from "typeorm";
import User from "../../src/entities/UserEntity";
import Session from "../../src/entities/SessionEntity";

export async function clearDatabase () {
  await getRepository(Session).delete({});
  await getRepository(User).delete({});
}
