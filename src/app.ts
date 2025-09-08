import express from 'express';
import globalErrorHandler from './middlewares/globalErrorHandler';
import userRouter from './user/userRouter';


const app = express();

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


app.use(globalErrorHandler);


export default app;






