import path from 'node:path';
import express from 'express';
import { createBook } from './bookController';
import multer from 'multer';




const bookRouter = express.Router();

//file store local 

const upload = multer({
  dest: path.resolve(__dirname, '../../public/data/uploads'),  //  store temporary file s here and if not exist multer itself create folder
  limits: {fileSize: 3e7}  //30mb
})


//routes
//=> /api/books

bookRouter.post('/', upload.fields([
  {name: 'coverImage', maxCount: 1},
  {name: 'file', maxCount: 1}
]), createBook); // fields for multiple files , single for single file



export default bookRouter;