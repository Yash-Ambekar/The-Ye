declare global {
  interface Stores {
    storeID: number;
    storeName: string;
    lat: number;
    long: number;
    storePhoneNumber: string;
    location: {};
    orderID: [{}];
  }

  interface UserDetails {
    phone_number: string;
    name: string;
    stage: number;
    imageID:string,
    rawMedInput: string;
    medicine: string;
    totalNumberOfMeds: number;
    latitude: number;
    longitude: number;
    currLocation: string;
    orderID: order[];
  }

  interface textDetails {
    name: string;
    phone_id: string;
    phone_number: string;
    msg: string;
  }

  interface imageDetails {
    name: string;
    phone_number: string;
    imageID: string;
    imageURL: string;
    imageMimeType: string;
    caption: string;
    imagePath:string;

  }

  interface locationDetails {
    name: string;
    replyType: string;
    phone_number: string;
    address: string;
    latitude: number;
    longitude: number;
  }

  interface replyDetails {
    name: string;
    phone_number: string;
    reply: string;
    replyType: string;
    contextMessageID: string;
    rawMedInput: string;
  }

  type changeDetailsReply = {
    replyType: string;
    reply: string;
    latitude: number;
    longitude: number;
    messageID: string;
    address: string;
  };

  interface order {
    $elemMatch: {
      storeName: string;
      storePhoneNumber: string;
      messageID: string;
      medicineName: string;
      currLocation: string;
    };
  }

  type getUser = {
    phone_number: string;
    name: string;
    orderID: [order] | order;
  };

  type getStore = {
    queryDetails: {};
  };
}

export {};
