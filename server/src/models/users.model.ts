import { userModel } from "./users.mongo";

async function checkUser(userPhoneNumber: string, userName: string) {
  try {
    const userInBSON = await userModel.countDocuments({
      phone_number: userPhoneNumber,
      name: userName,
    });
    return userInBSON;
  } catch (err) {
    console.log(err);
    return false;
  }
}

// Get the user details from phone number and username
export async function getUser(queryDetails: getUser) {
  try {
    const userInBSON = await userModel.findOne(queryDetails);
    const user = (await userInBSON?.toObject()) as UserDetails;

    if (!user) {
      const userDetails = {
        phone_number: queryDetails?.phone_number,
        name: queryDetails?.name,
        stage: 0,
        medicine: "",
        totalNumberOfMeds: 0,
        latitude: 0,
        longitude: 0,
        currLocation: "",
        orderID: [{}],
      };

      try {
        const userInBSON = await userModel.findOneAndUpdate(
          queryDetails,
          userDetails,
          {
            upsert: true,
            returnDocument: "after",
          }
        );
        const user = (await userInBSON?.toObject()) as UserDetails;
        console.log(`New User created \n ${JSON.stringify(user, null, 3)}`);
        return user;
      } catch (err) {
        console.error(err);
        return {} as UserDetails;
      }
    }

    //else return the user
    console.log(`getUser function call \n ${JSON.stringify(user, null, 3)}}`);
    return user;
  } catch (err) {
    console.log(`Something went wrong ${err}`);
    return {} as UserDetails;
  }
}

// Update the information of user in the database
export async function updateUser(
  queryDetails: getUser,
  updateDetail: UserDetails | getUser
) {
  try {
    const userInBSON = await userModel.findOneAndUpdate(
      queryDetails,
      updateDetail,
      {
        upsert: true,
        returnDocument: "after",
      }
    );
    const updatedUser = (await userInBSON.toObject()) as UserDetails;
    console.log(
      `updateUser function call \n ${JSON.stringify(updatedUser, null, 3)}`
    );
    return updatedUser;
  } catch (err) {
    console.error(`Something went wrong updating user: ${err}`);
  }
}

// Change the details of user using the location details
export async function changeDetailsUsingLocation(
  userPhoneNumber: string,
  replyDetails: locationDetails
) {
  if ((await checkUser(userPhoneNumber, replyDetails.name)) === 1) {
    const user = await getUser({
      phone_number: userPhoneNumber,
      name: replyDetails.name,
    } as getUser);
    if (user.stage < 4) {
      if (replyDetails?.replyType && replyDetails?.replyType === "location") {
        const updateDetails = {
          latitude: replyDetails.latitude,
          longitude: replyDetails.longitude,
          currLocation: replyDetails.address,
          stage: user.stage + 1,
        };
        const updatedUser = await updateUser(
          { phone_number: userPhoneNumber } as getUser,
          updateDetails as UserDetails
        );
        return updatedUser;
      }
    } else {
      const updateDetails = {
        stage: 0,
        medicine: "",
        totalNumberOfMeds: 0,
      };
      const updatedUser = await updateUser(
        { phone_number: userPhoneNumber } as getUser,
        updateDetails as UserDetails
      );
      console.log("User stage to 0\n ", updatedUser);
      return updatedUser;
    }
  } else {
    console.error("Multiple Users Found or no user found");
  }
}

// Change the details of user using the reply details
export async function changeDetailsUsingReply(
  userPhoneNumber: string,
  replyDetails: replyDetails
) {
  if ((await checkUser(userPhoneNumber, replyDetails.name)) === 1) {
    const user = await getUser({
      phone_number: userPhoneNumber,
      name: replyDetails.name,
    } as getUser);
    if (user.stage < 4) {
      if (
        replyDetails &&
        replyDetails?.replyType &&
        replyDetails?.replyType === "description"
      ) {
        if (user.medicine == "") {
          const updateDetails = {
            medicine: replyDetails?.reply,
            stage: user.stage + 1,
          };
          const updatedUser = await updateUser(
            { phone_number: userPhoneNumber } as getUser,
            updateDetails as UserDetails
          );
          return updatedUser;
        } else {
          const updateDetails = {
            medicine: user.medicine + ", " + replyDetails.reply,
          };
          const updatedUser = await updateUser(
            { phone_number: userPhoneNumber } as getUser,
            updateDetails as UserDetails
          );
          return updatedUser;
        }
      }
      if (user.totalNumberOfMeds === 0) {
        await updateUser(
          { phone_number: userPhoneNumber } as getUser,
          {
            stage: user.stage + 1,
          } as UserDetails
        );
      } else {
        await updateUser(
          { phone_number: userPhoneNumber } as getUser,
          {
            totalNumberOfMeds: user.totalNumberOfMeds - 1,
          } as UserDetails
        );
      }
    } else {
      const updateDetails = {
        stage: 0,
        medicine: "",
        totalNumberOfMeds: 0,
      };
      const updatedUser = await updateUser(
        { phone_number: userPhoneNumber } as getUser,
        updateDetails as UserDetails
      );
      console.log("User stage to 0\n ", updatedUser);
      return updatedUser;
    }
  } else {
    console.error("Multiple Users Found or no user found");
  }
}

export default {
  getUser,
  changeDetailsUsingLocation,
  changeDetailsUsingReply,
};
