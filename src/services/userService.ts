import { getRepository } from "typeorm";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid"
import User from "../entities/User";
import Session from "../entities/Sessions";

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
  if(bcrypt.compareSync(password, user.password)){
    const token = uuid();
    await getRepository(Session).insert({ token:token, userId: user.id });
    return token;
  }else{
    null
  }
}

export async function authenticate(token: string) {
  const session = await getRepository(Session).findOne({ 
    where: {  token },
    relations: ["user"]
  });
  if(!session){
    return null
  } else{
    return session.user
  }
}