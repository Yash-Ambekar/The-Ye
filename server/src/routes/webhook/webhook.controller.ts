import { checkCondition } from "../../utils/checkCondition";
import {
  handleText,
  handleLocationReply,
  handleImageReply,
  handleInteractiveMessages,
} from "../../utils/handleMessages";
import {
  getTextDetails,
  getImageDetails,
  getLocationDetails,
  getReplies,
} from "../../utils/getMessageDetails";
import { getUser } from "../../models/users.model";
import { Request, Response } from "express";



//Verifying the secret token sent by Facebook server
export function verifyToken(req: Request, res: Response) {
  if (
    req.query["hub.mode"] == "subscribe" &&
    req.query["hub.verify_token"] == "theye"
  ) {
    res.send(req.query["hub.challenge"]);
  } else {
    res.sendStatus(400);
  }
}


//Handles Whatsapp messages sent by client
export async function hookMessage(req: Request, res: Response) {
  if (req.body.object) {
    switch (checkCondition(req)) {
      case "text":
        const textDetails = getTextDetails(req);
        const user = await getUser({phone_number: textDetails.phone_number, name: textDetails.name} as getUser);
        await handleText(textDetails, user && user.stage);
        break;

      case "image":
        const imageDetails = await getImageDetails(req);
        await handleImageReply(imageDetails);
        break;

      case "location":
        const locationDetails = await getLocationDetails(req);
        console.log(req.body.entry[0].changes[0].value.messages[0].location);
        const userDetails = await getUser({phone_number: locationDetails.phone_number, name: locationDetails.name} as getUser);
        await handleLocationReply(userDetails, locationDetails);
        break;

      case "interactive":
        const replyDetails = getReplies(req);
        await handleInteractiveMessages(replyDetails);
        break;
    }

    res.sendStatus(200);
  }
}

export default {
  verifyToken,
  hookMessage,
};
