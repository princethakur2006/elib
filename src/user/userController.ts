import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

const createUser = async (req: Request, res : Response, next: NextFunction) => {
  const {name, email, password }= req.body
  // validation or use express validator
  if(!name || !email || !password){
    const error = createHttpError(400, "all fields are required");
    return next(error);
  }

  // process
  //response
  res.json({
    message: "user is created"
  })
}

export {createUser};