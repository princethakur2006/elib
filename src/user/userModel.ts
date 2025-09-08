import mongoose from 'mongoose'
import { User } from './userTypes';

const userSchema = new mongoose.Schema<User>({
  name: {
    type:String,
    required:true
  },

  email:{
    type:String,
    unique:true,
    required:true
  },

  password:{
    type:String,
    required:true,
  },
},   {timestamps: true} 
);

// mongoose create collection in database if our model name is user it plural name it create in db like user => users  or give name as a third parameters
export default mongoose.model<User>('user', userSchema)