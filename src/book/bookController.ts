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


const updateBook = async (req: Request, res: Response, next: NextFunction) => {
    const { title, genre } = req.body;
    const bookId = req.params.bookId;

    const book = await bookModel.findOne({ _id: bookId });

    if (!book) {
        return next(createHttpError(404, "Book not found"));
    }
    // Check access
    const _req = req as AuthRequest;
    if (book.author.toString() !== _req.userId) {
        return next(createHttpError(403, "You can not update others book."));
    }

    // check if image field is exists.

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    let completeCoverImage = "";
    if (files.coverImage) {
        const filename = files.coverImage?.[0]?.filename;
        const coverMimeType = files.coverImage?.[0]?.mimetype.split("/").at(-1);
        // send files to cloudinary
        const filePath = path.resolve(
            __dirname,
            "../../public/data/uploads/" + filename
        );
        completeCoverImage = filename || "";
        const uploadResult = await cloudinary.uploader.upload(filePath, {
            filename_override: completeCoverImage,
            folder: "book-covers",
            format: coverMimeType!,
        });

        completeCoverImage = uploadResult.secure_url;
        await fs.promises.unlink(filePath);
    }

    // check if file field is exists.
    let completeFileName = "";
    if (files.file) {
        const bookFilePath = path.resolve(
            __dirname,
            "../../public/data/uploads/" + files.file?.[0]?.filename
        );

        const bookFileName = files.file?.[0]?.filename;
        completeFileName = bookFileName || "";

        const uploadResultPdf = await cloudinary.uploader.upload(bookFilePath, {
            resource_type: "raw",
            filename_override: completeFileName,
            folder: "book-pdfs",
            format: "pdf",
        });

        completeFileName = uploadResultPdf.secure_url;
        await fs.promises.unlink(bookFilePath);
    }

    const updatedBook = await bookModel.findOneAndUpdate(
        {
            _id: bookId,
        },
        {
            title: title,
            genre: genre,
            coverImage: completeCoverImage
                ? completeCoverImage
                : book.coverImage,
            file: completeFileName ? completeFileName : book.file,
        },
        { new: true }
    );

    res.json(updatedBook);
};

// this endpoint will be public and will return all books
const listBooks = async(req:Request, res:Response, next:NextFunction) => {
  try {
    //todo
    const book = await bookModel.find(); // it return all records and documents in the database so we have to use pagination here
    res.json(book);
  } catch (err) {
    return next(createHttpError(500, "Unable to fetch books"));
  }
  

}

export { createBook , updateBook , listBooks };