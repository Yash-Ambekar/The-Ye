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
}

export {};
