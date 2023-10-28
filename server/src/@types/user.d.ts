///<reference path = "./store.d.ts">

declare interface UserDetails {
  phone_number: string;
  name: string;
  stage: number;
  imageID: string,
  rawMedInput: string;
  medicine: string;
  totalNumberOfMeds: number;
  latitude: number;
  longitude: number;
  currLocation: string;
  orderID: order[];
}

declare type getUser = {
  phone_number: string;
  name: string;
  orderID: [order] | order;
};