declare global {
  interface Stores {
    storeID: number;
    StoreName: string;
    lat: number;
    long: number;
    storePhoneNumber: string;
  };

  interface UserDetails  {
    phone_number: string;
    name: string;
    stage: number;
    medicine: string;
    totalNumberOfMeds: number;
    latitude: number;
    longitude: number;
    currLocation: string;
    messageID: string;
  };

  interface textDetails{
    name: string,
    phone_id: string,
    sender: string,
    msg: string,
  }

  interface imageDetails{
      name: string;
      sender: string;
      imageID: string;
      caption: string;
  
  }

  interface locationDetails{
    type: string;
    sender: string;
    address: string;
    latitude: number;
    longitude: number;
  }

  interface replyDetails{
    name: string;
    sender: string;
    reply: string;
    replyType: string;
  }
}

export {};
