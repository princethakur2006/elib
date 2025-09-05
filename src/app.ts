import express from 'express';


const app = express();


//Routes

//http methods: GET POST PUT PATCH DELETE OPTIONS
app.get('/', (req,res)=>{
  res.json({
    message:"welcome to elib apis"
  })
})



export default app;






