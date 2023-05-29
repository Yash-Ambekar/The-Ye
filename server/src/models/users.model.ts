import { userModel } from "./users.mongo";

let users = [
  {
    phone_number: "",
    name: "",
    stage: 0,
    medicine: "",
    totalNumberOfMeds: 0,
    latitude: 0,
    longitude: 0,
    currLocation: "",
    messageID: "",
  },
];

type combinedTypes =
  | replyDetails
  | textDetails
  | locationDetails
  | imageDetails;

function checkUser(userdbPhoneNumber: string, userPhoneNumber: string) {
  if (
    userdbPhoneNumber &&
    userPhoneNumber &&
    userdbPhoneNumber === userPhoneNumber
  )
    return true;
  return false;
}

function addUser(phone_number: string, name: string) {
  if (phone_number) {
    users.push({
      phone_number: phone_number,
      name: name,
      stage: 0,
      medicine: "",
      totalNumberOfMeds: 0,
      latitude: 0,
      longitude: 0,
      currLocation: "",
      messageID: "",
    });
  }

  return {
    phone_number: phone_number,
    name: name,
    stage: 0,
    medicine: "",
    latitude: 0,
    longitude: 0,
    totalNumberOfMeds: 0,
    currLocation: "",
    messageID: "",
  };
}

export async function getUser(userPhoneNumber: string, userName: string) {
  let userDetailsWithStage = {
    phone_number: "",
    name: "",
    stage: 0,
    medicine: "",
    totalNumberOfMeds: 0,
    latitude: 0,
    longitude: 0,
    currLocation: "",
    messageID: "",
  };
  if (!userPhoneNumber) return userDetailsWithStage;

  await Promise.all(
    users?.map((user) => {
      if (checkUser(user.phone_number, userPhoneNumber)) {
        userDetailsWithStage = user;
      }
    })
  );

  if (userDetailsWithStage.stage === 0) {
    const newUser = addUser(userPhoneNumber, userName);
    return newUser;
  }
  return userDetailsWithStage;
}

export function changeDetailsUsingLocation(
  userPhoneNumber: string,
  replyDetails: locationDetails
) {
  users?.map((user) => {
    if (checkUser(user.phone_number, userPhoneNumber)) {
      if (user.stage < 3) {
        if (replyDetails?.replyType && replyDetails?.replyType === "location") {
          user.latitude = replyDetails.latitude;
          user.longitude = replyDetails.longitude;
          user.currLocation = replyDetails.address;
        } 
        if (user.totalNumberOfMeds === 0) user.stage = user.stage + 1;
        else user.totalNumberOfMeds = user.totalNumberOfMeds - 1;
        // console.log(user);
        return user;
      } else {
        console.log("User stage to 0");
        user.stage = 0;
        user.medicine = "";
        user.totalNumberOfMeds = 0;
        return user;
      }
    }
  });
}

export function changeDetailsUsingReply(
  userPhoneNumber: string,
  replyDetails: replyDetails
) {
  users?.map((user) => {
    if (checkUser(user.phone_number, userPhoneNumber)) {
      if (user.stage < 3) {
        if (
          replyDetails &&
          replyDetails?.replyType &&
          replyDetails?.replyType === "description"
        ) {
          if (user.medicine == "") {
            user.medicine = replyDetails?.reply;
          } else {
            user.medicine = user.medicine + ", " + replyDetails.reply;
          }
        } 
        if (user.totalNumberOfMeds === 0) user.stage = user.stage + 1;
        else user.totalNumberOfMeds = user.totalNumberOfMeds - 1;
        // console.log(user);
        return user;
      } else {
        console.log("User stage to 0");
        user.stage = 0;
        user.medicine = "";
        user.totalNumberOfMeds = 0;
        return user;
      }
    }
  });
}

export default {
  getUser,
  changeDetailsUsingLocation,
  changeDetailsUsingReply,
};
