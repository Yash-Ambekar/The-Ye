///<reference path = "./src/@types/store.d.ts">
///<reference path = "./src/@types/messages.d.ts">
///<reference path = "./src/@types/user.d.ts">

import app from "./src/server";
import { connect, connection } from "mongoose";
import { loadModel } from "./src/classifier/imageClassifier";

const port = process.env["PORT"];
const mongoURL = process.env["MONGO_ATLAS_URI"];

connection.once("open", () => {
  console.log("Connected to Mongo!");
});

connection.on("error", (err) => {
  console.error(`Something went wrong: ${err}\n`);
});

async function runServer(){
  await loadModel();
  await connect(mongoURL as string);
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
}

runServer();
