const { checkCondition } = require("../../utils/checkCondition");
const { handleText, handleListReply , handleButtonReply} = require("../../utils/sendResponse");
const {
  getLocationDetails,
  getImageDetails,
  getTextDetails,
  getReplies,
} = require("../../utils/getMessageDetails");
const { getUser } = require("../../models/users.model");

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
  let med1Name = "";
  let med2Name = "";

  if (req.body.object) {
    // console.log(req.body?.entry[0].changes[0]?.value?.statuses)
    switch (checkCondition(req)) {
      case "text":
        const textDetails = getTextDetails(req);
        const user = await getUser(textDetails);
        console.log(user);
        await handleText(textDetails, user.stage);
        break;
      case "image":
        getImageDetails(req);
        break;
      case "location":
        getLocationDetails(req);
        break;
      case "interactive":
        const replyDetails = getReplies(req);
        if (
          replyDetails.reply &&
          replyDetails.reply !== "None" &&
          replyDetails.replyType === "description"
        ){
          const user = await getUser(replyDetails)
          handleListReply(replyDetails, user);
        }
        else if (
          replyDetails.reply &&
          replyDetails.reply !== "None" &&
          replyDetails.replyType === "button-reply"
        ){
          const user = await getUser(replyDetails)
          handleButtonReply(replyDetails, user);
        } 
        break;
    }
    // const medName = getMedicine(medicineName);
    // if (!medName) return res.sendStatus(400);

    res.json({ med1Name, med2Name });
  }
}

module.exports = {
  verifyToken,
  hookMessage,
};
