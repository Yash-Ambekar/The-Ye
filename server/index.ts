import app from "./src/server";
import { connect, connection } from "mongoose";

const port = process.env["PORT"];
const mongoURL = process.env["MONGO_ATLAS_URI"];

connection.once("open", () => {
  console.log("Connected to Mongo!");
});

connection.on("error", (err) => {
  console.error(`Something went wrong: ${err}\n`);
});

async function runServer(){
  await connect(mongoURL as string);
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
}

runServer();
