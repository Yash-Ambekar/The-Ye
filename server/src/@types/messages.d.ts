declare interface textDetails {
    name: string;
    phone_id: string;
    phone_number: string;
    msg: string;
}

declare interface imageDetails {
    name: string;
    phone_number: string;
    imageID: string;
    imageURL: string;
    imageMimeType: string;
    caption: string;
    imagePath: string;

}

declare interface locationDetails {
    name: string;
    replyType: string;
    phone_number: string;
    address: string;
    latitude: number;
    longitude: number;
}

declare interface replyDetails {
    name: string;
    phone_number: string;
    reply: string;
    replyType: string;
    contextMessageID: string;
    rawMedInput: string;
}
