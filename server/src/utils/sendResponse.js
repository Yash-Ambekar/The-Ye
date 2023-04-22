const user = require("../models/users.model");


async function sendPossibleName(medName,possibleMed, phoneNumber) {
   
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
            "to": phoneNumber,
            "type": "interactive",
            "interactive": {
              "type": "list",
            //   "header": {
            //     "type": "text",
            //     "text": "Choose Medicine Name"
            //   },
              "body": {
                "text": `*Choose* *the* *Medicine* *Name* Please click on a possible correct medicine name and then click on send`
              },
            //   "footer": {
            //     "text": "FOOTER_TEXT"
            //   },
              "action": {
                "button": medName? `*${medName}*`: "None",
                "sections": [
                  {
                    "rows": [
                      {
                        "id": "SECTION_1_ROW_1_ID",
                        "title": possibleMed[0]? possibleMed[0]: "None",
                      },
                      {
                        "id": "SECTION_1_ROW_2_ID",
                        "title": `${possibleMed[1]}` || "None",
                      },
                      {
                        "id": "SECTION_1_ROW_3_ID",
                        "title": `${possibleMed[2]}` || "None",
                      }, 
                      {
                        "id": "SECTION_1_ROW_4_ID",
                        "title": "None",
                      }
                    ]
                  },
                  
                ]
              }
            }
          }),
      }
    );
  
    console.log(response.status);
  }



async function sendHello(phoneNumber) {
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
          body: "Hello there! Please send your medicines in this format: ABC, DEF, GHI....",
        },
      }),
    }
  );

  console.log(response.status);
}

module.exports = {
  sendHello,
  sendPossibleName,
};
