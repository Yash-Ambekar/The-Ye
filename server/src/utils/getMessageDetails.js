function getTextDetails(req) {
  const phone_number_id =
    req.body.entry[0].changes[0].value.metadata.phone_number_id; // extract the phone number from the webhook payload
  const from = req.body.entry[0].changes[0].value.messages[0].from;
  const msg_body = req.body.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload
  console.log(
    "Message Details:",
    JSON.stringify({
      phone_id: phone_number_id,
      from_whom: from,
      msg: msg_body,
    })
  );

  return {
    phone_id: phone_number_id,
    sender: from,
    msg: msg_body,
  };
}

function getImageDetails(req) {
  const from = req.body.entry[0].changes[0].value.messages[0].from;
  const image_id = req.body.entry[0].changes[0].value.messages[0].image.id;
  const image_caption =
    req.body.entry[0].changes[0].value.messages[0].image.caption;
  console.log(
    "message Details:",
    JSON.stringify({
      from: from,
      img_id: image_id,
      captn: image_caption,
    })
  );

  return {
    from: from,
    img_id: image_id,
    captn: image_caption,
  };
}

function getLocationDetails(req) {
  const from = req.body.entry[0].changes[0].value.messages[0].from;
  const lat = req.body.entry[0].changes[0].value.messages[0].location.latitude;
  const long = req.body.entry[0].changes[0].value.messages[0].location.longitude;
  console.log(
    "message Details:",
    JSON.stringify({
      from: from,
      Latitude: lat,
      Longitude: long,
    })
  );

  return {
    from: from,
    Latitude: lat,
    Longitude: long,
  };
}

function getReplies(req) {
  const from = req.body.entry[0].changes[0].value.contacts[0].wa_id;
  let body = "";
  let type = "";
  if(req.body.entry[0].changes[0].value.messages[0].interactive.list_reply){
    body = req.body.entry[0].changes[0].value.messages[0].interactive.list_reply.description;
    type = "description";
  }
  else if(req.body.entry[0].changes[0].value.messages[0].interactive.button_reply){
    body = req.body.entry[0].changes[0].value.messages[0].interactive.button_reply.title;
    type = "button-reply";
  }
  console.log(
    "Reply Details:",
    JSON.stringify({
      sender: from,
      reply: body,
      replyType: type,
    })
  );

  return {
    sender: from,
    reply: body,
    replyType: type,
  };
}


module.exports = {
  getTextDetails,
  getImageDetails,
  getLocationDetails,
  getReplies,
};
