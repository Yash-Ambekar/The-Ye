import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    phone_number: {
        type:String,
        required: true,
    },
    name: {
        type:String,
        required: true,
    },
    stage: Number,
    imageID:String,
    rawMedInput:String,
    medicine: String,
    totalNumberOfMeds: Number,
    latitude: Number,
    longitude: Number,
    currLocation: String,
    orderID: [{}],
});

export const userModel = mongoose.model('Users', userSchema);

export default userModel;