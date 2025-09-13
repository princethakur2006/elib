import path from 'node:path';
import { Request, Response, NextFunction } from "express";
import cloudinary from "../config/cloudinary";
import createHttpError from 'http-errors';

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  // const { title, genre, description } = req.body;
  
  console.log("files", req.files);
  const files = req.files as {[fieldname: string]: Express.Multer.File[]};
  
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

    console.log("bookFileUploadResult", bookFileUploadResult);
    
  
  console.log("uploadResult", uploadResult);
  
  res.json({
  });
  } catch (error) {
    console.log("cloudinary upload error", error);
    return next(createHttpError(500, "Error while uploading file"));
  }

}

export { createBook };