const { checkCondition } = require("../../utils/checkCondition");
const { handleText, handleListReply , handleLocationReply, handleButtonReply, handleImageReply} = require("../../utils/sendResponse");
const {
  getLocationDetails,
  getImageDetails,
  getTextDetails,
  getReplies,
} = require("../../utils/getMessageDetails");
const { getUser, changeDetails } = require("../../models/users.model");

function verifyToken(req, res) {
  if (
    req.query["hub.mode"] == "subscribe" &&
    req.query["hub.verify_token"] == "theye"
  ) {
    res.send(req.query["hub.challenge"]);
  } else {
    res.sendStatus(400);
  }
}

async function hookMessage(req, res) {

  if (req.body.object) {

    switch (checkCondition(req)) {

      case "text": 
        const textDetails = getTextDetails(req);
        const user = await getUser(textDetails);
        console.log(user);
        await handleText(textDetails, user.stage);
        break;

      case "image":
        const imageDetails = getImageDetails(req);
        await handleImageReply(imageDetails);
        break;

      case "location":
        const locationDetails = getLocationDetails(req);
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

module.exports = {
  verifyToken,
  hookMessage,
};
