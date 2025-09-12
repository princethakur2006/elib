import mongoose from 'mongoose';
import { Book } from './bookTypes';

const bookSchema = new mongoose.Schema<Book>({
  title:{
    type:String,
    required:true,
  },
  // this author is a user from our user collection
  author:{
    type:mongoose.Schema.Types.ObjectId,  // object id is of user collection
    required:true,
  },

  coverImage: {
    type:String,
    required:true,
  },

  file: {
    type:String,
    required:true,
  },

  genre:{
    type:String,
    required:true,
  }
}, {timestamps:true}
);

export default mongoose.model<Book>('book', bookSchema);