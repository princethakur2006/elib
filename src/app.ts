import express from 'express';

import globalErrorHandler from './middlewares/globalErrorHandler';


const app = express();


//Routes

//http methods: GET POST PUT PATCH DELETE OPTIONS
app.get('/', (req,res)=>{
  res.json({
    message:"welcome to elib apis"
  })
})


app.use(globalErrorHandler);


export default app;






