import axios from "axios";
import { Request } from "express";
import fs, { writeFile } from "fs";


export function getTextDetails(req: Request) {
  const phone_number_id =
    req.body.entry[0].changes[0].value.metadata.phone_number_id; // extract the phone number from the webhook payload
  const from = req.body.entry[0].changes[0].value.contacts[0].wa_id;
  const name = req.body.entry[0].changes[0].value.contacts[0].profile.name;
  const msg_body = req.body.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload
  console.log(
    "Message Details:",
    JSON.stringify({
      name: name,
      phone_id: phone_number_id,
      from_whom: from,
      msg: msg_body,
    })
  );

  return {
    name: name,
    phone_id: phone_number_id,
    phone_number: from,
    msg: msg_body,
  };
}

async function getImageURL(mediaID: string) {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v17.0/${mediaID}/`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env["WHATSAPP_TOKEN"]}`,
        },
      }
    );
    const responseObject = await response.json();
    if (response.status === 200) {
      return { url: responseObject.url, mimetype: responseObject.mime_type };
    }
  } catch (err) {
    console.error(`Couldn't retrieve the imageURL: ${err}`);
  }
}


async function getImageFromURL(imageURL: string) {
  try {
    const response = await axios({
      method: 'get',
      url: imageURL,
      responseType: 'stream',
      headers: {'Authorization': `Bearer ${process.env["WHATSAPP_TOKEN"]}`},
    })
      .then(async function (response) {
        const time = Date.now();
        const path = `src/classifier/Images/${time}.jpeg`;
        await response.data.pipe(fs.createWriteStream(path));
        return path;
      });
      return response
    
  } catch (err) {
    console.error(`Couldn't retrieve the image: ${err}`);
  }
}

export async function getImageDetails(req: Request) {
  const from = req.body.entry[0].changes[0].value.contacts[0].wa_id;
  const name = req.body.entry[0].changes[0].value.contacts[0].profile.name;
  const image_id = req.body.entry[0].changes[0].value.messages[0].image.id;
  const image_caption =
    req.body.entry[0].changes[0].value.messages[0].image.caption;
  const imageURL = await getImageURL(image_id);
  const imagePath = await getImageFromURL(imageURL?.url);
  console.log(
    "Image Details:",
    JSON.stringify({
      name: name,
      sender: from,
      imageID: image_id,
      imageURL: imageURL?.url,
      imageMimeType: imageURL?.mimetype,
      caption: image_caption,
      imagePath:imagePath,
    })
  );

  return {
    name: name,
    phone_number: from,
    imageID: image_id,
    imageURL: imageURL?.url,
    imageMimeType: imageURL?.mimetype,
    caption: image_caption,
    imagePath:imagePath,
  };
}

export async function getLocationDetails(req: Request) {
  const from = req.body.entry[0].changes[0].value.contacts[0].wa_id;
  const name = req.body.entry[0].changes[0].value.contacts[0].profile.name;
  // const address = req.body.entry[0].changes[0].value.messages[0].location.address;
  const lat = req.body.entry[0].changes[0].value.messages[0].location.latitude;
  const long =
    req.body.entry[0].changes[0].value.messages[0].location.longitude;

  const orign_req = `${lat},${long}`;
  const url =
    "https://maps.googleapis.com/maps/api/distancematrix/json?" +
    new URLSearchParams({
      origins: orign_req,
      destinations: orign_req,
      key: process.env["GOOGLE_MAPS_API_KEY"] ?? "",
    });

  var config = {
    method: "get",
    url: url,
  };

  const response = await axios(config);
  const address = response.data.origin_addresses[0];

  console.log(
    "Location Details:",
    JSON.stringify({
      name: name,
      phone_number: from,
      address: address,
      Latitude: lat,
      Longitude: long,
    })
  );

  return {
    replyType: "location",
    name: name,
    phone_number: from,
    address: address,
    latitude: lat,
    longitude: long,
  };
}

export function getReplies(req: Request) {
  const from = req.body.entry[0].changes[0].value.contacts[0].wa_id;
  const wamid = req.body.entry[0].changes[0].value.messages[0]?.context.id;
  const name = req.body.entry[0].changes[0].value.contacts[0].profile.name;
  let body = "";
  let type = "";
  if (req.body.entry[0].changes[0].value.messages[0].interactive.list_reply) {
    body =
      req.body.entry[0].changes[0].value.messages[0].interactive.list_reply
        .title === "None"
        ? "None"
        : req.body.entry[0].changes[0].value.messages[0].interactive.list_reply
            .description;
    type = "description";
  } else if (
    req.body.entry[0].changes[0].value.messages[0].interactive.button_reply
  ) {
    body =
      req.body.entry[0].changes[0].value.messages[0].interactive.button_reply
        .title;
    type = "button-reply";
  }
  console.log(
    "Reply Details:",
    JSON.stringify({
      name: name,
      messageID: wamid,
      phone_number: from,
      reply: body,
      replyType: type,
    })
  );

  return {
    name: name,
    phone_number: from,
    reply: body,
    replyType: type,
    contextMessageID: wamid,
  };
}

export default {
  getTextDetails,
  getImageDetails,
  getLocationDetails,
  getReplies,
};
