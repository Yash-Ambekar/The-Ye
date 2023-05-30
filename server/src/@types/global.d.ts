declare global {
  interface Stores {
    storeID: number;
    storeName: string;
    lat: number;
    long: number;
    storePhoneNumber: string;
  }

  interface UserDetails {
    phone_number: string;
    name: string;
    stage: number;
    medicine: string ;
    totalNumberOfMeds: number;
    latitude: number ;
    longitude: number ;
    currLocation: string;
    messageID: string ;
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
    caption: string;
  }

  interface locationDetails {
    name: string
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
  }

  type changeDetailsReply = {
    replyType: string;
    reply:string;
    latitude:number ;
    longitude:number;
    messageID: string;
    address:string;
  }
}

export {};
