import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from 'bcrypt';
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "./userTypes";

const createUser = async (req: Request, res : Response, next: NextFunction) => {
  const {name, email, password }= req.body
  // validation or use express validator
  if(!name || !email || !password){
    const error = createHttpError(400, "all fields are required");
    return next(error);
  }
   
  // database call
  try {
    const user = await userModel.findOne({email})   //usermodel is a alias
    if(user){
    const error = createHttpError(400, "user already exist with this email");
    return next(error);
  }
  } catch (error) {
    return next(createHttpError(500, "Error while getting user"))
  }


  // password => hashing:
  const hashPassword = await bcrypt.hash(password, 10);

  let newUser: User;
  try {
    newUser = await userModel.create({
    name,
    email,
    password:hashPassword
  })
  } catch (error) {
    return next(createHttpError(500, "Error while creating user"))
  }

  

  // token generation JWT  => it returns a string
  //in sign ({this object is a payload => sub property id of user}, secret key string, expire time)

  try {
    const token = sign({sub: newUser._id}, config.jwtSecret as string, {expiresIn: '7d'})
    //response
    res.status(201).json({
    accessToken: token,
  });
  } catch (error) {
    return createHttpError(500, "Error while signing the jwt token")
  }
  
};

const loginUser = async(req: Request, res: Response, next: NextFunction) => {
  const {email, password} = req.body;

  if(!email || !password){
    next(createHttpError(400, "All fields are required"))
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return next(createHttpError(404, "User not found")); // handled as normal flow
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
      return next(createHttpError(400, "username and password is incorrect"))
    }
    //if matched then we have to create new access token 

    try {
      const token = sign({sub: user._id}, config.jwtSecret as string, {expiresIn: '7d'})
      //response
      res.status(201).json({
      accessToken: token,
      });
    } catch (error) {
      return createHttpError(500, "Error while signing the jwt token")
    }

  } catch (err) {
      // actual DB errors
      return next(createHttpError(500, "Database error"));
  }
}

export {createUser, loginUser};