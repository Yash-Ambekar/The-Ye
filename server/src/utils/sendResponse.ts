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
          body: {
            text: `*Choose* *the* *Medicine* *Name*
Please click on a possible correct medicine name and then click on send`,
          },
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

*Location*: ${userDetails.currLocation ? userDetails.currLocation : ""} 

*You can 🔄reset and start from the beginning if you have made a mistake*`,

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
                  title: "Reset",
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
                  title: "Show interest",
                },
              },
            ],
          },
        },
      }),
    }
  );

  console.log(response.status);
  const responseObject = await response.json();
  console.log(responseObject);
  return responseObject?.messages[0]?.id;
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
  const stores = await getStores({
    queryDetails: {
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [userDetails.longitude, userDetails.latitude],
          },
          $maxDistance: 5000,
        },
      },
    },
  });
  await Promise.all(
    stores?.map(async (store) => {
      await sendImageToStore(store.storePhoneNumber, imageID);
    })
  );
}
// Sending Patients Medicine Request to the Stores

export async function sendToStores(userDetails: UserDetails) {
  const stores = await getStores({
    queryDetails: {
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [userDetails.longitude, userDetails.latitude],
          },
          $maxDistance: 5000,
        },
      },
    },
  } as getStore);
  let messageDetails: Object[] = [];
  await Promise.all(
    stores?.map(async (store) => {
      const messageID = await sendRequestToSingleStore(
        userDetails.phone_number,
        store.storePhoneNumber,
        userDetails.medicine,
        userDetails.currLocation
      );
      messageDetails.push({
        storeName: store.storeName,
        storePhoneNumber: store.storePhoneNumber,
        medicineName: userDetails.medicine,
        currLocation: userDetails.currLocation,
        messageID: messageID,
      });
    })
  );

  return messageDetails;
}

export async function sendError(userPhoneNumber: string) {
  const errorText = `❌ ERROR
Please follow the instruction and reply accordingly as it helps us process your request to the best of our ability`;
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
        to: `${userPhoneNumber}`,
        type: "text",
        text: {
          preview_url: false,
          body: errorText,
        },
      }),
    }
  );

  console.log(response.status);
}

export default {
  sendText,
  sendPossibleName,
  sendConfirmation,
  sendImageToStore,
  sendToStores,
  sendError,
};
