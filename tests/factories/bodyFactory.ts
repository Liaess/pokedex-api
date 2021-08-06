import faker from "faker";
import bcrypt from "bcrypt";
import { getRepository } from "typeorm";
import User from "../../src/entities/UserEntity";
import { v4 as uuid } from "uuid";
import Session from "../../src/entities/SessionEntity";
import Pokemon_User from "../../src/entities/Pokemon_UserEntity";

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

export async function createNewSession(email: string, passowrd: string) {
    const token = uuid();
    const hashedPassword = bcrypt.hashSync(passowrd, 10);
    await getRepository(User).insert({email, password: hashedPassword});
    const user = await getRepository(User).findOne({
        where: {
            email
        }
    })
    await getRepository(Session).insert({ usersId: user.id, token});
    return token
};

export async function Pokemon_UserTableCheck(){
    const relation = await getRepository(Pokemon_User).find();
    return relation;
};
