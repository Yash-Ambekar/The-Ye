
declare interface order {
    $elemMatch: {
        storeName: string;
        storePhoneNumber: string;
        messageID: string;
        medicineName: string;
        currLocation: string;
    };
}

declare type getStore = {
    queryDetails: {};
}

declare interface Stores {
    storeID: number;
    storeName: string;
    lat: number;
    long: number;
    storePhoneNumber: string;
    location: {};
    orderID: [{}];
}


