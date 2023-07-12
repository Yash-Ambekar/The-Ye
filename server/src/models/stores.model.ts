import axios from "axios";
import { storeModel } from "./stores.mongo";
import { type } from "os";

const stores = [
  // {
  //     storeID: 0,
  //     storeName: "Soham's Medical Store",
  //     lat: 19.46414031683653,
  //     long: 73.83218669449842,
  //     storePhoneNumber: process.env['SOHAM_PHONE_NUMBER'] ?? ""
  // },
  // {
  //     storeID: 1,
  //     storeName: "Parth's Medical Store",
  //     lat: 18.46490396061193,
  //     long: 73.83431215586559,
  //     storePhoneNumber: process.env['PARTH_PHONE_NUMBER'] ?? ""
  // },
  // {
  //     storeID: 2,
  //     storeName: "Pankaj's Medical Store",
  //     lat: 18.468385695514733,
  //     long: 73.83333458652628,
  //     storePhoneNumber: process.env['PANKAJ_PHONE_NUMBER'] ?? ""
  // },
  {
    storeID: 3,
    storeName: "Yash's Medical Store",
    lat: 19.10869426849005,
    long: 72.88467675985991,
    storePhoneNumber: process.env.YASH_PHONE_NUMBER ?? "",
  },
];

async function getDistance(origin: number[], destination: number[]) {
  let dist = 0;
  const orign_req = `${origin[0]},${origin[1]}`;
  const destn_req = `${destination[0]},${destination[1]}`;
  const params = new URLSearchParams({
    origins: orign_req,
    destinations: destn_req,
    key: process.env.GOOGLE_MAPS_API_KEY ?? "",
  });

  const url =
    "https://maps.googleapis.com/maps/api/distancematrix/json?" +
    params.toString();

  const config = {
    method: "get",
    url,
  };

  const response = await axios(config);
  dist = response.data.rows[0].elements[0].distance.value;

  return dist;
}

export async function getStores2(userDetails: UserDetails) {
  const origin = [userDetails.latitude, userDetails.longitude];

  const newStores: Stores[] = [];

  await Promise.all(
    stores.map(async (store) => {
      const destination = [store.lat, store.long];
      const distance = await getDistance(origin as number[], destination);
      // Finding the stores within 5KM radius
      if (distance < 5000) {
        newStores.push(store as Stores);
      }
    })
  );
  return newStores;
}


export async function getStores(query: getStore){

  try{
    const nearByStores:Stores[] = [];
    const storesInBSON = await storeModel.find(query.queryDetails).exec();
    await Promise.all(storesInBSON.map((doc)=>{
      nearByStores.push(doc.toObject() as Stores);
    }))
    console.log("getStore Reponse\n")
    console.log(nearByStores);
    return nearByStores
  }catch(err){
    console.log(`Something went wrong \n${err}`)
    return [] as Stores[]
  }
}

export async function updateStoreDetails(
  storeName: string,
  storePhoneNumber: string,
  updateDetails: object
) {
  try {
    const storeInBSON = await storeModel.findOneAndUpdate(
      {
        storePhoneNumber,
        storeName,
      },
      updateDetails,
      {
        upsert: true,
        returnDocument: "after",
      }
    );

    const updatedStore = (await storeInBSON.toObject()) as Stores;
    console.log(`updateStore function call \n ${JSON.stringify(updatedStore)}`);
    return updatedStore;
  } catch (err) {
    console.error(`Something went wrong updating user: ${err}`);
  }
}

export default {
  stores,
  getStores,
  updateStoreDetails,
};