import {
  sendText,
  sendConfirmation,
  sendImageToStores,
  sendPossibleName,
  sendToStores,
  sendError,
} from "./sendResponse";
import { fuzzyLogicSearch } from ".././models/medicine.model";
import {
  changeDetailsUsingLocation,
  changeDetailsUsingReply,
  getUser,
  updateUser,
} from "../models/users.model";
import { getStores } from "../models/stores.model";
import { checkForReply } from "./checkCondition";



export async function handleText(
  textDetails: textDetails,
  stage: number | null
) {
  switch (stage) {
    case 0:
      await sendText(textDetails.phone_number, "");
      await changeDetailsUsingReply(textDetails.phone_number, {
        name: textDetails.name,
      } as replyDetails);
      break;
    case 1:
      const med = await fuzzyLogicSearch(textDetails.msg);
      await sendPossibleName(textDetails.msg, med, textDetails.phone_number);
      await changeDetailsUsingReply(textDetails.phone_number, {
        name: textDetails.name,
      } as replyDetails);
      break;
    case 2:
    case 3:
    case 4:
      await sendError(textDetails.phone_number);
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

export async function handleConfirmButton(
  replyDetails: replyDetails,
  userDetails: UserDetails
) {
  const messageDetails = await sendToStores(userDetails);
  await updateUser(
    { phone_number: userDetails.phone_number } as getUser,
    { orderID: messageDetails } as getUser
  );
  await changeDetailsUsingReply(userDetails.phone_number, replyDetails);
}

export async function handleImageReply(imageDetails: imageDetails) {
  const imageID = imageDetails.imageID;
  const sender = imageDetails.phone_number;
  const caption = imageDetails.caption;
  const userDetails = await getUser({
    phone_number: imageDetails.phone_number,
    name: imageDetails.name,
  } as getUser);
  await sendImageToStores(imageID, userDetails);
  await sendToStores(userDetails);
}

export async function handleLocationReply(
  userDetails: UserDetails,
  locationDetails: locationDetails
) {
  const updatedUser = await changeDetailsUsingLocation(
    userDetails.phone_number,
    locationDetails
  );
  await sendConfirmation(updatedUser as UserDetails);
}

export async function handleAcceptButton(replyDetails: replyDetails) {
  const user = await getUser({
    orderID: { $elemMatch: { messageID: replyDetails.contextMessageID } },
  } as getUser);
  const store = await getStores({
    queryDetails: {
      storePhoneNumber: replyDetails.phone_number,
    },
  } as getStore);
  const textMessage = `*${store[0].storeName}* has shown interest in your order. Please contact the medical store as per your convenience.
  contact number: ${replyDetails.phone_number}`;
  await sendText(user.phone_number, textMessage);
}

export async function handleInteractiveMessages(replyDetails: replyDetails) {
  const reply = checkForReply(replyDetails);
  if (reply === "description") {
    const user = await getUser({
      phone_number: replyDetails.phone_number,
      name: replyDetails.name,
    } as getUser);
    await handleListReply(replyDetails, user);
  } else if (reply === "Confirm") {
    const user = await getUser({
      phone_number: replyDetails.phone_number,
      name: replyDetails.name,
    } as getUser);
    await handleConfirmButton(replyDetails, user);
  } else if (reply === "Show interest") {
    await handleAcceptButton(replyDetails);
  }
}

export default {
  handleText,
  handleListReply,
  handleConfirmButton,
  handleImageReply,
  handleLocationReply,
  handleInteractiveMessages,
};
