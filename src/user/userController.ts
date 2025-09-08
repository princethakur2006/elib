

import { NextFunction, Request, Response } from "express";

const createUser = async (
  req: Request, 
  res : Response, 
  _next: NextFunction
) => {
  res.json({
    message: "user is created"
  })
}

export {createUser};