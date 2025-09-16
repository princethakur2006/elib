import express from 'express';
import cors from 'cors';
import globalErrorHandler from './middlewares/globalErrorHandler';
import userRouter from './user/userRouter';
import bookRouter from './book/bookRouter';
import { config } from './config/config';


const app = express();

app.use(cors({
  origin:config.frontend_domain,
})) // it says allow all the request

app.use(express.json());


//Routes

//http methods: GET POST PUT PATCH DELETE OPTIONS
app.get('/', (req,res)=>{
  res.json({
    message:"welcome to elib apis"
  })
})

// to register router 

app.use('/api/users', userRouter);
app.use('/api/books', bookRouter);


app.use(globalErrorHandler);


export default app;






