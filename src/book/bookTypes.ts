import { User } from "../user/userTypes";

export interface Book {
  _id:string;
  title:string;
  author: User;
  genre: string;
  coverImage: string; // image url which we upload on cloudinary
  file:string; // file url which we upload on cloudinary(pdf)
  createdAt: Date;
  updatedAt: Date;
}