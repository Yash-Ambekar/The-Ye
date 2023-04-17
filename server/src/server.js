const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config({ path: ".././config.env" });
const port = process.env['PORT'] || 8000;


const messageRouter = require('./routes/messages/messages.router')
const app = express();
app.use(cors());
app.use(express.json());
app.use('/messages', messageRouter);

app.listen(port, ()=>{
    console.log(`Listening on port ${port}`);
})