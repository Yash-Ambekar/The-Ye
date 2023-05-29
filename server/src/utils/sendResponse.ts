import { fuzzyLogicSearch } from ".././models/medicine.model";
import { changeDetailsUsingLocation, changeDetailsUsingReply, getUser } from "../models/users.model";
import { getStores } from "../models/stores.model";


interface possibleMed {
  [index: string]: string | number;
  top1: string;
  top2: string;
  top3: string;
  score: number;
}


export async function sendPossibleName(
  medName: string,
  possibleMed: possibleMed,
  phoneNumber: string
) {
  const row = [];
  for (let i = 1; i < 4; i++) {
    if (possibleMed["top" + i]) {
      const topValue = possibleMed["top" + i] as string;
      row.push({
        id: `SECTION_1_ROW_${i}_ID`,
        title: `${topValue.split(" ").slice(0, 1).join(" ")}` || "None",
        description: `${topValue}` || "",
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

export async function sendText(phoneNumber: string, text: string) {
  const helloText = `Hello 👋! Please type in the name of the medicine you need. If you're not sure about the spelling, just type in a few letters and we'll suggest some options for you.

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

export async function sendConfirmation(userDetails: UserDetails) {
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

export async function sendRequestToSingleStore(
  patientsPhoneNumber: string,
  storePhoneNumber: string,
  medicine: string,
  location: string
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

export async function sendImageToStore(
  storePhoneNumber: string,
  imageID: string
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
        to: storePhoneNumber,
        type: "image",
        image: {
          id: imageID,
        },
      }),
    }
  );

  console.log(response.status);
}

export async function sendImageToStores(
  imageID: string,
  userDetails: UserDetails
) {
  const stores = await getStores(userDetails);
  await Promise.all(
    stores?.map(async (store) => {
      await sendImageToStore(store.storePhoneNumber, imageID);
    })
  );
}
// Sending Patients Medicine Request to the Stores

export async function sendToStores(userDetails: UserDetails) {
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

export async function handleText(
  textDetails: textDetails,
  stage: number | null
) {
  switch (stage) {
    case 0:
      await sendText(textDetails.phone_number, "");
      changeDetailsUsingReply(textDetails.phone_number, {} as replyDetails);
      break;
    case 1:
      const med = await fuzzyLogicSearch(textDetails.msg);
      await sendPossibleName(textDetails.msg, med, textDetails.phone_number);
      break;
  }
}

export async function handleListReply(
  replyDetails: replyDetails,
  userDetails: UserDetails
) {
  changeDetailsUsingReply(userDetails.phone_number, replyDetails);
  const text = `Please send your current location by following these instructions:
  
➥Attachments 📎  
➥Location 📍
➥Switch on Location Services ⚙️
➥Send Current Location`;
  await sendText(userDetails.phone_number, text);
}

export async function handleButtonReply(
  replyDetails: replyDetails,
  userDetails: UserDetails
) {
  await sendToStores(userDetails);
  changeDetailsUsingReply(userDetails.phone_number, replyDetails);
}

export async function handleImageReply(imageDetails: imageDetails) {
  const imageID = imageDetails.imageID;
  const sender = imageDetails.phone_number;
  const caption = imageDetails.caption;
  const userDetails = await getUser(imageDetails.phone_number, imageDetails.name);
  await sendImageToStores(imageID, userDetails);
  await sendToStores(userDetails);
}

export async function handleLocationReply(
  userDetails: UserDetails,
  locationDetails: locationDetails
) {
  changeDetailsUsingLocation(userDetails.phone_number, locationDetails);
  await sendConfirmation(userDetails);
}

export async function handleInteractiveMessages(replyDetails:replyDetails){
  if (
    replyDetails.reply &&
    replyDetails.reply !== "None" &&
    replyDetails.replyType === "description"
  ){
    const user = await getUser(replyDetails.phone_number, replyDetails.name);
    console.log(user)
    handleListReply(replyDetails, user);

  }
  else if (
    replyDetails.reply &&
    replyDetails.reply === "Confirm" &&
    replyDetails.replyType === "button-reply"
  ){
    const user = await getUser(replyDetails.phone_number, replyDetails.name);
    console.log(user);
    handleButtonReply(replyDetails, user);
  } 
  else if (
    replyDetails.reply &&
    replyDetails.reply === "Accept" &&
    replyDetails.replyType === "button-reply"
  ){

  }
}

export default {
  sendText,
  sendPossibleName,
  sendConfirmation,
  sendImageToStore,
  sendToStores,
  handleText,
  handleListReply,
  handleButtonReply,
  handleImageReply,
  handleLocationReply,
  handleInteractiveMessages,
};
