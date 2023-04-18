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

app.get('/', (req, res)=>{
    return res.send("Hello World");
})
app.get('/webhooks',  (req, res) => {
    console.log(req);
    if (
        req.query['hub.mode'] == 'subscribe' &&
        req.query['hub.verify_token'] == "theye"
    ) {
        res.send(req.query['hub.challenge']);
    } else {
        res.sendStatus(400);
    }
});

app.post("/webhooks", (req, res) => {
    // Parse the request body from the POST
    let body = req.body;
    // console.log(body);
    // if(body){
    //     res.sendStatus(200);
    // }
    // else{
    //     res.sendStatus(400);
    // }
    // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
    if (req.body.object) {
      if (
        req.body.entry &&
        req.body.entry[0].changes &&
        req.body.entry[0].changes[0] &&
        req.body.entry[0].changes[0].value.messages &&
        req.body.entry[0].changes[0].value.messages[0]
      ) {
  
        // do your stuff here.....
  
        let phone_number_id =
          req.body.entry[0].changes[0].value.metadata.phone_number_id;
        let from = req.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
        let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload
        console.log("message Details:", JSON.stringify({
            phone_id: phone_number_id,
            from_whom: from,
            msg: msg_body
        }))
      }
      res.sendStatus(200);
    } else {
      // Return a '404 Not Found' if event is not from a WhatsApp API
      res.sendStatus(404);
    }
  });

app.listen(port, ()=>{
    console.log(`Listening on port ${port}`);
})