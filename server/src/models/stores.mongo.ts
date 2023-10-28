import mongoose from "mongoose";

const storesSchema = new mongoose.Schema({
  storeID: {
    type: Number,
    required: true,
    default: 0,
  },
  storeName: {
    type: String,
    required: true,
  },
  lat: {
    type: Number,
    required:true,
  },
  long: {
    type: Number,
    required:true,
  },
  storePhoneNumber: {
    type: String,
    required:true,
  },
  location:{
    type:{},
    required:true,
  },
  orderSentTo: [{}]
});

export const storeModel = mongoose.model('Medical_Stores', storesSchema);

export default storeModel;