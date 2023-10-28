import express, {Express, Request, Response} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

//Routers
import webHookRouter from './routes/webhook/webhook.router';

//App Declaration
const app: Express= express();

//Middleware
app.use(cors());
app.use(express.json());
app.use('/webhooks', webHookRouter);


app.get('/', (req:Request, res:Response)=>{
    return res.send("Hello World");
})


export default app;