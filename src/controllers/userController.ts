import { Request, Response } from "express";
import { userSchema } from "../schemas/userSchemas";
import * as userService from "../services/userService";

export async function signUp(req: Request, res: Response) {
  try{
    const { email, password, confirmPassword } = req.body as { email: string, password: string, confirmPassword:string };
    if(password !== confirmPassword) return res.sendStatus(400);
    const value = userSchema.validate({email, password});
    if(value.error) return res.sendStatus(400);
    const checkEmail = await userService.checkEmail(email);
    if(checkEmail) return res.sendStatus(409);
    await userService.signUp(email, password);
    res.sendStatus(201);
  }catch(e){
    console.log(e);
    res.sendStatus(500);
  }
}

export async function signIn(req: Request, res: Response) {
  try{
    const { email, password } = req.body as { email: string, password: string };
    const value = userSchema.validate({email, password});
    if(value.error) return res.sendStatus(400);
    const token = await userService.signIn(email, password);
    if(token === null) return res.sendStatus(401);
    res.send({token})
  }catch(e){
    console.log(e);
    res.sendStatus(500);
  }
}