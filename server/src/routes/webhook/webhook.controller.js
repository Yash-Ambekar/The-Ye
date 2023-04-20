const {checkCondition} = require('../../utils/checkCondition')
const {getLocationDetails, getImageDetails, getTextDetails} = require('../../utils/getMessageDetails')


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

function hookMessage(req, res) {
  if (req.body.object) {
    switch(checkCondition(req)) {
      case "text":
        getTextDetails(req);
        break;
      case "image":
        getImageDetails(req);
        break;
      case "location":
        getLocationDetails(req);
        break;
      default:
        res.sendStatus(400);
    }
    // const medName = getMedicine(medicineName);
    // if (!medName) return res.sendStatus(400);
    res.sendStatus(200);
    
  } 
}




module.exports = {
  verifyToken,
  hookMessage,
};
