const {
  getMedicine,
  fuzzyLogicSearch,
} = require("../../models/medicine.model");
const { checkCondition } = require("../../utils/checkCondition");
const { sendHello, sendPossibleName } = require("../../utils/sendResponse");
const {
  getLocationDetails,
  getImageDetails,
  getTextDetails,
} = require("../../utils/getMessageDetails");

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
        const details = getTextDetails(req);
        // const med = await getMedicine(details.msg);
        const med = await fuzzyLogicSearch(details.msg);
        // med1Name = med.name1;
        // med2Name = med.name2;
        // await sendHello(details.sender);
        await sendPossibleName(details.msg, med, details.sender)
        break;
      case "image":
        getImageDetails(req);
        break;
      case "location":
        getLocationDetails(req);
        break;
      default:
        console.log("Not Working");
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
