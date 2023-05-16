import {checkCondition} from  "../../utils/checkCondition"
import { handleText, handleListReply , handleLocationReply, handleButtonReply, handleImageReply} from "../../utils/sendResponse";
import {
  getTextDetails,
  getImageDetails,
  getLocationDetails,
  getReplies,
} from "../../utils/getMessageDetails";
import { getUser } from "../../models/users.model";
import { Request, Response } from 'express'

export function verifyToken(req:Request, res:Response) {
  if (
    req.query["hub.mode"] == "subscribe" &&
    req.query["hub.verify_token"] == "theye"
  ) {
    res.send(req.query["hub.challenge"]);
  } else {
    res.sendStatus(400);
  }
}

export async function hookMessage(req:Request, res:Response) {

  if (req.body.object) {

    switch (checkCondition(req)) {

      case "text": 
        const textDetails = getTextDetails(req);
        const user = await getUser(textDetails);
        console.log(user);
        await handleText(textDetails, user && user.stage);
        break;

      case "image":
        const imageDetails = await getImageDetails(req);
        await handleImageReply(imageDetails);
        break;

      case "location":
        const locationDetails = await getLocationDetails(req);
        console.log(req.body.entry[0].changes[0].value.messages[0].location)
        const userDetails = await getUser(locationDetails);
        await handleLocationReply(userDetails, locationDetails)
        break;

      case "interactive":
        const replyDetails = getReplies(req);
        if (
          replyDetails.reply &&
          replyDetails.reply !== "None" &&
          replyDetails.replyType === "description"
        ){
          const user = await getUser(replyDetails)
          console.log(user)
          handleListReply(replyDetails, user);

        }
        else if (
          replyDetails.reply &&
          replyDetails.reply === "Confirm" &&
          replyDetails.replyType === "button-reply"
        ){
          const user = await getUser(replyDetails)
          console.log(user)
          handleButtonReply(replyDetails, user);
        } 
        else if (
          replyDetails.reply &&
          replyDetails.reply === "Accept" &&
          replyDetails.replyType === "button-reply"
        ){

        }
        break;
    }

    res.sendStatus(200);
  }
}


export default {
   verifyToken,
   hookMessage,
}
