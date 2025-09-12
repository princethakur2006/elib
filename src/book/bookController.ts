import { Request, Response, NextFunction } from "express";

const createBook = async (req: Request, res: Response, _next: NextFunction) => {
  const { title, genre, description } = req.body;
  console.log(title, genre, description);
  
  res.json({

  })
}

export {createBook};