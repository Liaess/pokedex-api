import faker from "faker";
import bcrypt from "bcrypt";
import { getRepository } from "typeorm";
import User from "../../src/entities/UserEntity";

export function signUpBody(){
    return{
        email: faker.internet.email(),
        password: faker.internet.password(),
    }
}

export async function createUser(email: string, passowrd: string){
    const hashedPassword = bcrypt.hashSync(passowrd, 10);
    await getRepository(User).insert({email, password: hashedPassword});
}