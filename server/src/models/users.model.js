let users = [
  {
    phone_number: "",
    name: "",
    stage: 0,
    medicine: "",
    totalNumberOfMeds: 0,
  },
  {
    phone_number: "917021938092",
    name: "",
    stage: 0,
    medicine: "",
    totalNumberOfMeds: 0,
  },
];

function checkUser(user, userDetails) {
  if (user.phone_number && user.phone_number === userDetails.sender || user.phone_number === userDetails.phone_number)
    return true;
  return false;
}

function addUser(user) {
  if (user.sender) {
    users.push({
      phone_number: user.sender,
      name: "Raju",
      stage: 0,
      medicine: "",
      totalNumberOfMeds: 0,
    });
  }

  return {
    phone_number: user.sender,
    name: user.name,
    stage: 0,
    medicine: "",
    totalNumberOfMeds: 0,
  };
}

async function getUser(userDetails) {
  if (!userDetails.sender) return null;
  let userDetailsWithStage = "";
  users?.map((user) => {
    if (checkUser(user, userDetails)) {
      userDetailsWithStage = user;
    }
  });

  if (!userDetailsWithStage) {
    const newUser = addUser(userDetails);
    return newUser;
  }
  return userDetailsWithStage;
}

function changeDetails(userDetails, replyDetails) {
  if (userDetails.sender === "") return null;
  users?.map((user) => {
    if (checkUser(user, userDetails)) {
      if (user.stage < 3) {
        if (replyDetails && replyDetails.replyType && replyDetails.replyType === "description") {
          if (user.medicine == "") {
            user.medicine = replyDetails.reply;
          } else {
            user.medicine = user.medicine + ", " + replyDetails.reply;
          }
        }
        if (user.totalNumberOfMeds === 0) user.stage = user.stage + 1;
        else user.totalNumberOfMeds = user.totalNumberOfMeds - 1;
        console.log(user);
        return user;
      } else {
        user.stage = 0;
        user.medicine = "";
        user.totalNumberOfMeds = 0;
        return user;
      }
    }
  });
}

module.exports = {
  users,
  getUser,
  changeDetails,
};
