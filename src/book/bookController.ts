import path from 'node:path';
import fs from 'node:fs';
import { Request, Response, NextFunction } from "express";
import cloudinary from "../config/cloudinary";
import createHttpError from 'http-errors';
import bookModel from './bookModel';
import { AuthRequest } from '../middlewares/authenticate';

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre} = req.body;
  
  console.log("files", req.files);
  const files = req.files as {[fieldname: string]: Express.Multer.File[]}; // files may be undefined
  // mimetype : 'application/pdf' 
  
  const coverImageMimeType = files.coverImage?.[0]?.mimetype.split('/').at(-1); //['image','png']
  const filename = files.coverImage?.[0]?.filename;
  const filepath = path.resolve(__dirname, '../../public/data/uploads', filename!);
  
  try {
    const uploadResult = await cloudinary.uploader.upload(filepath, {
    filename_override: filename!,
    folder: 'book-cover',
    format: coverImageMimeType!,
    });

  const bookFileName = files.file?.[0]?.filename;

  const bookFilePath = path.resolve(__dirname, '../../public/data/uploads', bookFileName!);


  const bookFileUploadResult = await cloudinary.uploader.upload(bookFilePath, {
    resource_type: 'raw', // for pdf or doc
    filename_override: bookFileName!,
    folder: 'book-pdfs',
    format:"pdf"
    })

    //console.log("bookFileUploadResult", bookFileUploadResult);
    
  
  //console.log("uploadResult", uploadResult);

  //@ts-ignore
  //console.log('userId', req.userId);
  
//creating (inserting) a new book record into your database.
  const _req = req as AuthRequest
  const newBook = await  bookModel.create({
    title,
    genre,
    author: _req.userId,
    coverImage:uploadResult.secure_url,
    file: bookFileUploadResult.secure_url,
  });


  // Delete temporary files after upload is complete  and wrap it in try catch 
  try {
    await fs.promises.unlink(filepath);
    await fs.promises.unlink(bookFilePath);
  } catch (error) {
    console.error("Error deleting temporary files", error);
    return next(createHttpError(500, "Error deleting temporary files"));
  }

  res.status(201).json({
    id:newBook._id
  });
  } catch (error) {
    console.log("cloudinary upload error", error);
    return next(createHttpError(500, "Error while uploading file"));
  }

}

export { createBook };