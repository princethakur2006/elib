import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from 'bcrypt';

const createUser = async (req: Request, res : Response, next: NextFunction) => {
  const {name, email, password }= req.body
  // validation or use express validator
  if(!name || !email || !password){
    const error = createHttpError(400, "all fields are required");
    return next(error);
  }
   
  // database call
  const user = await userModel.findOne({email})   //usermodel is a alias

  if(user){
    const error = createHttpError(400, "user already exist with this email");

    return next(error);
  }

  // password => hashing:
  const hashPassword = await bcrypt.hash(password, 10);
  // process
  //response
  res.json({
    message: "user is created"
  })
}

export {createUser};