const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config({ path: ".././config.env" });
const port = process.env['PORT'] || 8000;

//Routers
const webHookRouter = require('./routes/webhook/webhook.router');

//App Declaration
const app = express();

//Middleware
app.use(cors());
app.use(express.json());
app.use('/webhooks', webHookRouter);


app.get('/', (req, res)=>{
    return res.send("Hello World");
})


app.listen(port, ()=>{
    console.log(`Listening on port ${port}`);
})