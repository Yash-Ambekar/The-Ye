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
    medicine: String,
    totalNumberOfMeds: Number,
    latitude: Number,
    longitude: Number,
    currLocation: [String],
    messageID: String,
});

export const userModel = mongoose.model('Users', userSchema);

export default userModel;