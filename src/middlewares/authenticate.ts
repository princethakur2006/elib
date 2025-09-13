import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import {verify} from 'jsonwebtoken';
import { config } from '../config/config';

export interface AuthRequest extends Request{
  userId:string
}


// it is an middleware to authenticate the user using jwt token

const authenticate = (req:Request, res:Response, next:NextFunction)=>{
  const token = req.header('Authorization')
  if(!token){
    return next(createHttpError(401, "authorization token is required "))
  }


  try {
    const parsedToken = token.split(' ')[1];
    if (!parsedToken) {
    return next(createHttpError(401, "Invalid token format"));
    }
    const decoded = verify(parsedToken, config.jwtSecret as string) ;
    
    if (!config.jwtSecret) {
    throw new Error("JWT secret not defined in config");
    }
    const _req = req as AuthRequest
    _req.userId = decoded.sub as string ;
    next();
  } catch (err) {
    return next(createHttpError(401, "token expired"))
  }
  // console.log("decoded", decoded);
  
  
}

export default authenticate;