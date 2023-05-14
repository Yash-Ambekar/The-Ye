const { fuzzyLogicSearch } = require(".././models/medicine.model");
const { changeDetails, getUser } = require("../models/users.model");
const { getStores } = require("../models/stores.model");

async function sendPossibleName(medName, possibleMed, phoneNumber) {
  const row = [];
  for (let i = 0; i < 3; i++) {
    if (possibleMed[i]) {
      row.push({
        id: `SECTION_1_ROW_${i}_ID`,
        title: `${possibleMed[i].split(" ").slice(0, 1).join(" ")}` || "None",
        description: `${possibleMed[i]}` || "",
      });
    }
  }
  row.push({
    id: "SECTION_1_ROW_4_ID",
    title: "None",
  });
  const response = await fetch(
    `https://graph.facebook.com/v16.0/${process.env["WHATSAPP_PHONE_NUMBER_ID"]}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env["WHATSAPP_TOKEN"]}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: phoneNumber,
        type: "interactive",
        interactive: {
          type: "list",
          //   "header": {
          //     "type": "text",
          //     "text": "Choose Medicine Name"
          //   },
          body: {
            text: `*Choose* *the* *Medicine* *Name*
Please click on a possible correct medicine name and then click on send`,
          },
          //   "footer": {
          //     "text": "FOOTER_TEXT"
          //   },
          action: {
            button: medName ? `*${medName}*` : "None",
            sections: [
              {
                rows: row,
              },
            ],
          },
        },
      }),
    }
  );

  console.log(response.status);
}

async function sendText(phoneNumber, text) {
  const helloText =
    `Hello 👋! Please type in the name of the medicine you need. If you're not sure about the spelling, just type in a few letters and we'll suggest some options for you.

You can also send us a photo of your prescription. To do this, tap on the paperclip icon below and select 'Camera'📷 or 'Gallery'. We'll review it and get back to you soon. Thanks! ✌️`;
  const response = await fetch(
    `https://graph.facebook.com/v16.0/${process.env["WHATSAPP_PHONE_NUMBER_ID"]}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env["WHATSAPP_TOKEN"]}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: `${phoneNumber}`,
        type: "text",
        text: {
          preview_url: false,
          body: text ? text : helloText,
        },
      }),
    }
  );

  console.log(response.status);
}

async function sendConfirmation(userDetails) {
  const response = await fetch(
    `https://graph.facebook.com/v16.0/${process.env["WHATSAPP_PHONE_NUMBER_ID"]}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env["WHATSAPP_TOKEN"]}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: `${userDetails.phone_number}`,
        type: "interactive",
        interactive: {
          type: "button",
          body: {
            text: `*Confirm the List of Medicines and Location*

${userDetails.medicine ? userDetails.medicine : ""}

*Location*: ${userDetails.currLocation}`,
          },
          action: {
            buttons: [
              {
                type: "reply",
                reply: {
                  id: "UNIQUE_BUTTON_ID_1",
                  title: "Confirm",
                },
              },
              {
                type: "reply",
                reply: {
                  id: "UNIQUE_BUTTON_ID_2",
                  title: "Cancel",
                },
              },
            ],
          },
        },
      }),
    }
  );

  console.log(response.status);
}

async function sendRequestToSingleStore(
  patientsPhoneNumber,
  storePhoneNumber,
  medicine,
  location
) {
  const response = await fetch(
    `https://graph.facebook.com/v16.0/${process.env["WHATSAPP_PHONE_NUMBER_ID"]}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env["WHATSAPP_TOKEN"]}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: `${storePhoneNumber}`,
        type: "interactive",
        interactive: {
          type: "button",
          body: {
            text: `*Medicine Name*: ${medicine ? medicine : "Check the Image"}

*Location*: ${location}

*Patients Phone Number*: ${patientsPhoneNumber}`,
          },
          action: {
            buttons: [
              {
                type: "reply",
                reply: {
                  id: "UNIQUE_BUTTON_ID_1",
                  title: "Accept",
                },
              },
              {
                type: "reply",
                reply: {
                  id: "UNIQUE_BUTTON_ID_2",
                  title: "Reject",
                },
              },
            ],
          },
        },
      }),
    }
  );

  console.log(response.status);
}

async function sendImageToStore(
  storePhoneNumber,
  imageID
) {
  const response = await fetch(
    `https://graph.facebook.com/v16.0/${process.env["WHATSAPP_PHONE_NUMBER_ID"]}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env["WHATSAPP_TOKEN"]}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": storePhoneNumber,
        "type": "image",
        "image": {
          "id": imageID
        }
      }),
    }
  );

  console.log(response.status);
}

async function sendImageToStores(imageID) {
  const stores = await getStores(userDetails);
  await Promise.all(
    stores?.map(async (store) => {
      await sendImageToStore(
        store.storePhoneNumber,
        imageID
      );
    })
  );
}
// Sending Patients Medicine Request to the Stores

async function sendToStores(userDetails) {
  const stores = await getStores(userDetails);
  await Promise.all(
    stores?.map(async (store) => {
      await sendRequestToSingleStore(
        userDetails.phone_number,
        store.storePhoneNumber,
        userDetails.medicine,
        userDetails.currLocation
      );
    })
  );
}

async function handleText(userDetails, stage) {
  switch (stage) {
    case 0:
      await sendText(userDetails.sender);
      changeDetails(userDetails);
      break;
    case 1:
      const med = await fuzzyLogicSearch(userDetails.msg);
      await sendPossibleName(userDetails.msg, med, userDetails.sender);
      break;
  }
}

async function handleListReply(replyDetails, userDetails) {
  changeDetails(userDetails, replyDetails);
  const text = `Please send your current location by following these instructions:
  
➥Attachments 📎  
➥Location 📍
➥Switch on Location Services ⚙️
➥Send Current Location`
  await sendText(userDetails.phone_number, text);
}

async function handleButtonReply(replyDetails, userDetails) {
  await sendToStores(userDetails);
  changeDetails(userDetails, replyDetails);
}

async function handleImageReply(imageDetails) {
  const imageID = imageDetails.imageID;
  const sender = imageDetails.sender;
  const caption = imageDetails.caption;
  const userDetails = getUser(imageDetails);
  await sendImageToStores(imageID);
  await sendToStores(userDetails);
}

async function handleLocationReply(userDetails, locationDetails) {
  changeDetails(userDetails, locationDetails)
  await sendConfirmation(userDetails);
}

module.exports = {
  sendText,
  sendPossibleName,
  sendConfirmation,
  sendImageToStore,
  sendToStores,
  handleText,
  handleListReply,
  handleButtonReply,
  handleImageReply,
  handleLocationReply
};
