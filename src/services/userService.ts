import { getRepository } from "typeorm";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid"
import User from "../entities/UserEntity";
import Session from "../entities/SessionEntity";

export async function checkEmail(email:string) {
  return await getRepository(User).findOne({ email });
}

export async function signUp(email: string, password: string) {
  const hashedPassword = bcrypt.hashSync(password, 10);

  await getRepository(User).insert({email, password: hashedPassword});
}

export async function signIn(email: string, password: string): Promise<string> {
  const user = await getRepository(User).findOne({ email });
  if(!user) return null
  const checkPassoword = bcrypt.compareSync(password, user.password)
  if(checkPassoword){
    const token = uuid();
    await getRepository(Session).insert({ token:token, usersId: user.id });
    return token;
  }else{
    null
  }
}

export async function authenticate(token: string) {
  const session = await getRepository(Session).findOne({ 
    where: { token },
    relations: ["users"]
  });
  if(!session){
    return null
  } else{
    return session.users
  }
}